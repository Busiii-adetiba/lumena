/**
 * Issue #294 — Soroban WASM Metadata Parser and ScVal Type Serializer Generator
 *
 * Inspects compiled Soroban contract WASM binaries to extract exported function
 * signatures, argument types, and documentation strings, then automatically
 * generates TypeScript type definitions and ScVal converter functions.
 *
 * The Soroban toolchain embeds two kinds of custom WASM sections:
 *
 *   contractenvmetav0  — XDR-encoded Soroban environment metadata (SDK version)
 *   contractspecv0     — XDR-encoded contract spec (functions, types, doc strings)
 *
 * This module handles both sections:
 *  - parseContractMeta  — Reads contractenvmetav0 and returns SDK version info
 *  - parseContractSpec  — Reads contractspecv0, decodes each XDR entry, and
 *                         returns structured function/type specifications
 *  - generateTypeScript — Produces TypeScript interfaces and ScVal converter
 *                         functions from a parsed contract spec
 *
 * References:
 *   https://soroban.stellar.org/docs/soroban-internals/contract-abi
 *   https://github.com/stellar/rs-soroban-env/tree/main/soroban-env-common/src/meta.rs
 */

// ---------------------------------------------------------------------------
// Types — parsed contract metadata
// ---------------------------------------------------------------------------

/**
 * Metadata extracted from the contractenvmetav0 custom WASM section.
 */
export interface ContractEnvMeta {
  /** Soroban interface version number encoded in the section. */
  interfaceVersion: bigint;
}

/**
 * A single argument in a contract function specification.
 */
export interface ContractFunctionArg {
  /** Argument name as declared in the contract. */
  name: string;
  /** Human-readable Soroban type string (e.g. "u64", "Address", "Vec<i32>"). */
  type: string;
  /** Documentation string extracted from the contract, if any. */
  doc?: string;
}

/**
 * A single output entry from a contract function (functions may return multiple values
 * via ScVal tuples, though most return one).
 */
export interface ContractFunctionOutput {
  /** Human-readable type string. */
  type: string;
  /** Documentation string, if any. */
  doc?: string;
}

/**
 * Full specification of a single exported contract function.
 */
export interface ContractFunction {
  /** Function name as it appears in the WASM export table. */
  name: string;
  /** Documentation string from the contract source. */
  doc?: string;
  /** Ordered list of input arguments. */
  inputs: ContractFunctionArg[];
  /** Ordered list of return types. */
  outputs: ContractFunctionOutput[];
}

/**
 * A field within a user-defined struct type in the contract spec.
 */
export interface ContractStructField {
  name: string;
  type: string;
  doc?: string;
}

/**
 * A variant within a user-defined enum or union type.
 */
export interface ContractEnumVariant {
  name: string;
  /** Discriminant value (for error/integer enums). */
  value?: number;
  doc?: string;
}

/**
 * Specification of a user-defined type exported from the contract.
 */
export interface ContractTypeSpec {
  name: string;
  kind: 'struct' | 'enum' | 'union' | 'error';
  doc?: string;
  fields?: ContractStructField[];
  variants?: ContractEnumVariant[];
}

/**
 * The complete parsed interface of a Soroban contract.
 */
export interface ContractSpec {
  /** All exported functions. */
  functions: ContractFunction[];
  /** All user-defined types (structs, enums, unions). */
  types: ContractTypeSpec[];
}

// ---------------------------------------------------------------------------
// WASM section parsing
// ---------------------------------------------------------------------------

const CUSTOM_SECTION_ID = 0;
const ENV_META_SECTION  = 'contractenvmetav0';
const SPEC_SECTION      = 'contractspecv0';

/**
 * Reads a LEB128-encoded unsigned integer from a Uint8Array at the given
 * offset. Returns the decoded value and the number of bytes consumed.
 */
function readULEB128(bytes: Uint8Array, offset: number): { value: number; length: number } {
  let result = 0;
  let shift  = 0;
  let length = 0;

  while (offset + length < bytes.length) {
    const byte = bytes[offset + length]!;
    length++;
    result |= (byte & 0x7f) << shift;
    shift  += 7;
    if ((byte & 0x80) === 0) break;
  }

  return { value: result, length };
}

/**
 * Reads a WASM-encoded string (u32 length prefix + UTF-8 bytes) from the
 * given offset in a byte array.
 */
function readString(bytes: Uint8Array, offset: number): { value: string; length: number } {
  const lenResult = readULEB128(bytes, offset);
  const strLen    = lenResult.value;
  const strBytes  = bytes.slice(offset + lenResult.length, offset + lenResult.length + strLen);
  return {
    value:  new TextDecoder().decode(strBytes),
    length: lenResult.length + strLen,
  };
}

/**
 * Extracts a named custom section from a WASM binary.
 *
 * @param wasmBytes  Raw WASM bytes (ArrayBuffer or Uint8Array).
 * @param sectionName The custom section name to locate.
 * @returns           The section payload bytes, or null when not found.
 */
export function extractCustomSection(
  wasmBytes: ArrayBuffer | Uint8Array,
  sectionName: string,
): Uint8Array | null {
  const bytes = wasmBytes instanceof Uint8Array
    ? wasmBytes
    : new Uint8Array(wasmBytes);

  // Validate WASM magic + version
  const MAGIC   = [0x00, 0x61, 0x73, 0x6d];
  const VERSION = [0x01, 0x00, 0x00, 0x00];

  for (let i = 0; i < 4; i++) {
    if (bytes[i] !== MAGIC[i] || bytes[4 + i] !== VERSION[i]) {
      throw new Error('extractCustomSection: invalid WASM magic/version header');
    }
  }

  let offset = 8; // skip magic + version

  while (offset < bytes.length) {
    const sectionId  = bytes[offset]!;
    offset++;

    const sizeResult = readULEB128(bytes, offset);
    const sectionSize = sizeResult.value;
    offset += sizeResult.length;

    const sectionStart = offset;

    if (sectionId === CUSTOM_SECTION_ID) {
      const nameResult = readString(bytes, offset);
      offset += nameResult.length;

      if (nameResult.value === sectionName) {
        // Return the payload (everything after the name string)
        return bytes.slice(offset, sectionStart + sectionSize);
      }
    }

    // Advance past this section
    offset = sectionStart + sectionSize;
  }

  return null;
}

// ---------------------------------------------------------------------------
// contractenvmetav0 parsing
// ---------------------------------------------------------------------------

/**
 * Parses the contractenvmetav0 custom section from a WASM binary and returns
 * the Soroban environment interface version.
 *
 * @param wasmBytes Raw contract WASM bytes.
 * @returns         ContractEnvMeta, or null when the section is absent.
 */
export function parseContractMeta(
  wasmBytes: ArrayBuffer | Uint8Array,
): ContractEnvMeta | null {
  const payload = extractCustomSection(wasmBytes, ENV_META_SECTION);
  if (!payload) return null;

  // The section is a sequence of XDR-encoded ScEnvMetaEntry values.
  // Each entry begins with a 4-byte big-endian discriminant:
  //   0x00000000 = ScEnvMetaKindInterfaceVersion  (followed by 8-byte uint64)
  // We read the first entry only and return its version.
  if (payload.length < 12) return null;

  const view    = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const kind    = view.getUint32(0, false /* big-endian */);

  if (kind !== 0) return null; // Unknown kind

  const hi              = view.getUint32(4, false);
  const lo              = view.getUint32(8, false);
  const interfaceVersion = (BigInt(hi) << 32n) | BigInt(lo);

  return { interfaceVersion };
}

// ---------------------------------------------------------------------------
// contractspecv0 parsing
// ---------------------------------------------------------------------------

/**
 * Parses the contractspecv0 custom section from a WASM binary and returns a
 * structured ContractSpec containing all exported functions and types.
 *
 * The section contains a sequence of XDR-encoded ScSpecEntry values. We parse
 * these into plain JavaScript objects and reconstruct the type names from their
 * XDR discriminants.
 *
 * @param wasmBytes Raw contract WASM bytes.
 * @returns         ContractSpec with functions and types, or null when absent.
 */
export function parseContractSpec(
  wasmBytes: ArrayBuffer | Uint8Array,
): ContractSpec | null {
  const payload = extractCustomSection(wasmBytes, SPEC_SECTION);
  if (!payload) return null;

  // Parse XDR entries. We use a simplified, dependency-free XDR reader that
  // handles the subset of types used by the contract spec format. Production
  // code should use the @stellar/stellar-sdk xdr module directly; this
  // self-contained implementation avoids coupling to a specific SDK version.
  const entries = parseSpecEntries(payload);

  const functions: ContractFunction[] = [];
  const types: ContractTypeSpec[]    = [];

  for (const entry of entries) {
    switch (entry.kind) {
      case 'function':
        functions.push(entry.function!);
        break;
      case 'struct':
      case 'enum':
      case 'union':
      case 'error':
        types.push(entry.typeSpec!);
        break;
    }
  }

  return { functions, types };
}

// ---------------------------------------------------------------------------
// TypeScript code generator
// ---------------------------------------------------------------------------

/**
 * Generates TypeScript source code from a parsed ContractSpec.
 *
 * The output includes:
 *  - A TypeScript interface for each user-defined struct type
 *  - A string-enum for each user-defined enum / error type
 *  - An async function for each exported contract function that accepts typed
 *    arguments and returns the expected output type
 *  - Per-function ScVal converter stubs (toScVal / fromScVal calls) so callers
 *    can pass native JS values instead of XDR objects
 *
 * @param spec       Parsed contract specification.
 * @param contractId Optional contract ID to embed in JSDoc comments.
 * @returns          TypeScript source string ready to be written to a .ts file.
 */
export function generateTypeScript(spec: ContractSpec, contractId?: string): string {
  const lines: string[] = [];

  lines.push(`// AUTO-GENERATED by Lumena Soroban metadata parser`);
  if (contractId) {
    lines.push(`// Contract: ${contractId}`);
  }
  lines.push(`// Do not edit manually — regenerate from the contract WASM binary.\n`);
  lines.push(`import { xdr, Address, nativeToScVal, scValToNative } from '@stellar/stellar-sdk';`);
  lines.push(`import type { ContractClient } from '@lumen/core';\n`);

  // ── User-defined types ────────────────────────────────────────────────────
  for (const t of spec.types) {
    if (t.doc) {
      lines.push(`/** ${t.doc} */`);
    }

    switch (t.kind) {
      case 'struct': {
        lines.push(`export interface ${t.name} {`);
        for (const field of t.fields ?? []) {
          if (field.doc) lines.push(`  /** ${field.doc} */`);
          lines.push(`  ${field.name}: ${sorobanTypeToTs(field.type)};`);
        }
        lines.push(`}\n`);
        break;
      }

      case 'enum':
      case 'error': {
        lines.push(`export enum ${t.name} {`);
        for (const variant of t.variants ?? []) {
          if (variant.doc) lines.push(`  /** ${variant.doc} */`);
          const valSuffix = variant.value !== undefined ? ` = ${variant.value}` : '';
          lines.push(`  ${variant.name}${valSuffix},`);
        }
        lines.push(`}\n`);
        break;
      }

      case 'union': {
        // Represent unions as discriminated unions
        lines.push(`export type ${t.name} =`);
        const variantLines = (t.variants ?? []).map(
          (v) => `  | { kind: '${v.name}' }`,
        );
        lines.push(variantLines.join('\n') + ';\n');
        break;
      }
    }
  }

  // ── Contract function wrappers ────────────────────────────────────────────
  if (spec.functions.length > 0) {
    lines.push(`// ─── Contract function wrappers ────────────────────────────────────────────`);
    lines.push(`// Each function accepts native JavaScript values and converts them to ScVals.`);
    lines.push(`// Call these via a ContractClient instance.\n`);

    for (const fn of spec.functions) {
      if (fn.doc) {
        lines.push(`/**`);
        lines.push(` * ${fn.doc}`);
        lines.push(` */`);
      }

      // Parameter list
      const params = fn.inputs
        .map((arg) => `${arg.name}: ${sorobanTypeToTs(arg.type)}`)
        .join(', ');

      const returnType = fn.outputs.length === 1
        ? sorobanTypeToTs(fn.outputs[0]!.type)
        : fn.outputs.length > 1
          ? `[${fn.outputs.map((o) => sorobanTypeToTs(o.type)).join(', ')}]`
          : 'void';

      lines.push(
        `export async function ${toCamelCase(fn.name)}(`
        + `client: ContractClient, contractId: string`
        + (params ? `, ${params}` : '')
        + `): Promise<${returnType}> {`,
      );

      // ScVal conversion for each argument
      if (fn.inputs.length > 0) {
        lines.push(`  const args: xdr.ScVal[] = [`);
        for (const arg of fn.inputs) {
          lines.push(`    ${scValConverterFor(arg.type, arg.name)},`);
        }
        lines.push(`  ];`);
      }

      lines.push(`  const result = await client.simulate(`);
      lines.push(`    { contractId, method: '${fn.name}', args: ${fn.inputs.length > 0 ? 'args' : '[]'} },`);
      lines.push(`  );`);
      lines.push(`  if (!result.successful) throw new Error(result.error ?? 'Contract call failed');`);

      if (returnType !== 'void') {
        lines.push(`  return scValToNative(result.returnValue as any) as ${returnType};`);
      }

      lines.push(`}\n`);
    }
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Internal — XDR spec entry parser
// ---------------------------------------------------------------------------

interface SpecEntry {
  kind: 'function' | 'struct' | 'enum' | 'union' | 'error' | 'unknown';
  function?: ContractFunction;
  typeSpec?: ContractTypeSpec;
}

/**
 * Minimal self-contained XDR reader for contractspecv0 entries.
 *
 * The binary format is a sequence of 4-byte big-endian discriminants followed
 * by the entry payload. This parser extracts what it can and falls back to
 * 'unknown' for unrecognised discriminants so new spec versions don't crash
 * older SDK consumers.
 *
 * In production, replace this with stellar-sdk's generated XDR bindings for
 * full fidelity parsing.
 */
function parseSpecEntries(payload: Uint8Array): SpecEntry[] {
  const view    = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const entries: SpecEntry[] = [];
  let offset = 0;

  try {
    while (offset + 4 <= payload.length) {
      const discriminant = view.getUint32(offset, false);
      offset += 4;

      switch (discriminant) {
        // SC_SPEC_ENTRY_FUNCTION_V0 = 0
        case 0: {
          const { entry, consumed } = parseFunctionEntry(payload, offset, view);
          offset += consumed;
          entries.push({ kind: 'function', function: entry });
          break;
        }

        // SC_SPEC_ENTRY_UDT_STRUCT_V0 = 1
        case 1: {
          const { entry, consumed } = parseStructEntry(payload, offset, view);
          offset += consumed;
          entries.push({ kind: 'struct', typeSpec: entry });
          break;
        }

        // SC_SPEC_ENTRY_UDT_UNION_V0 = 2
        case 2: {
          const { entry, consumed } = parseUnionEntry(payload, offset, view);
          offset += consumed;
          entries.push({ kind: 'union', typeSpec: entry });
          break;
        }

        // SC_SPEC_ENTRY_UDT_ENUM_V0 = 3
        case 3: {
          const { entry, consumed } = parseEnumEntry(payload, offset, view);
          offset += consumed;
          entries.push({ kind: 'enum', typeSpec: entry });
          break;
        }

        // SC_SPEC_ENTRY_UDT_ERROR_ENUM_V0 = 4
        case 4: {
          const { entry, consumed } = parseEnumEntry(payload, offset, view);
          offset += consumed;
          entries.push({ kind: 'error', typeSpec: { ...entry, kind: 'error' } });
          break;
        }

        default:
          // Unknown entry — stop parsing to avoid corruption
          offset = payload.length;
          break;
      }
    }
  } catch {
    // Partial parse is acceptable; return what was decoded so far.
  }

  return entries;
}

// ── Entry parsers ────────────────────────────────────────────────────────────

function readXdrString(payload: Uint8Array, offset: number): { value: string; consumed: number } {
  const view   = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const len    = view.getUint32(offset, false);
  const strEnd = offset + 4 + len;
  const str    = new TextDecoder().decode(payload.slice(offset + 4, strEnd));
  // XDR strings are padded to 4-byte boundaries
  const padded = Math.ceil(len / 4) * 4;
  return { value: str, consumed: 4 + padded };
}

function readXdrType(payload: Uint8Array, offset: number, view: DataView): { type: string; consumed: number } {
  const discriminant = view.getUint32(offset, false);
  // Map discriminants to human-readable type names (abbreviated set)
  const TYPE_MAP: Record<number, string> = {
    0:  'void',    1:  'bool',   2:  'error',
    3:  'u32',     4:  'i32',    5:  'u64',
    6:  'i64',     7:  'u128',   8:  'i128',
    9:  'u256',    10: 'i256',   11: 'Bytes',
    12: 'BytesN',  13: 'String', 14: 'Symbol',
    15: 'Vec',     16: 'Map',    17: 'Address',
    18: 'Option',  19: 'Result', 1000: 'Custom',
  };

  const typeName = TYPE_MAP[discriminant] ?? `ScType(${discriminant})`;

  // Simple scalars: just the discriminant
  if (discriminant < 15 || (discriminant >= 13 && discriminant <= 14) || discriminant === 17) {
    return { type: typeName, consumed: 4 };
  }

  // Vec / Option / Result / Map have a nested type — skip over it (4 bytes min)
  if (discriminant === 15 || discriminant === 16 || discriminant === 18 || discriminant === 19) {
    return { type: typeName, consumed: 8 };
  }

  // BytesN has a u32 length
  if (discriminant === 12) {
    return { type: `BytesN<${view.getUint32(offset + 4, false)}>`, consumed: 8 };
  }

  // Custom (UDT name)
  if (discriminant === 1000) {
    const nameResult = readXdrString(payload, offset + 4);
    return { type: nameResult.value, consumed: 4 + nameResult.consumed };
  }

  return { type: typeName, consumed: 4 };
}

function parseFunctionEntry(
  payload: Uint8Array,
  offset: number,
  view: DataView,
): { entry: ContractFunction; consumed: number } {
  const start = offset;

  // doc string
  const docResult = readXdrString(payload, offset);
  offset += docResult.consumed;

  // name string
  const nameResult = readXdrString(payload, offset);
  offset += nameResult.consumed;

  // inputs: u32 count then array of { doc, name, type }
  const inputCount = view.getUint32(offset, false);
  offset += 4;

  const inputs: ContractFunctionArg[] = [];
  for (let i = 0; i < inputCount; i++) {
    const argDoc  = readXdrString(payload, offset); offset += argDoc.consumed;
    const argName = readXdrString(payload, offset); offset += argName.consumed;
    const argType = readXdrType(payload, offset, view); offset += argType.consumed;
    inputs.push({ name: argName.value, type: argType.type, doc: argDoc.value || undefined });
  }

  // outputs: u32 count then array of { doc, type }
  const outputCount = view.getUint32(offset, false);
  offset += 4;

  const outputs: ContractFunctionOutput[] = [];
  for (let i = 0; i < outputCount; i++) {
    const outDoc  = readXdrString(payload, offset); offset += outDoc.consumed;
    const outType = readXdrType(payload, offset, view); offset += outType.consumed;
    outputs.push({ type: outType.type, doc: outDoc.value || undefined });
  }

  return {
    entry: {
      name:    nameResult.value,
      doc:     docResult.value || undefined,
      inputs,
      outputs,
    },
    consumed: offset - start,
  };
}

function parseStructEntry(
  payload: Uint8Array,
  offset: number,
  view: DataView,
): { entry: ContractTypeSpec; consumed: number } {
  const start = offset;

  const docResult  = readXdrString(payload, offset); offset += docResult.consumed;
  const nameResult = readXdrString(payload, offset); offset += nameResult.consumed;

  const fieldCount = view.getUint32(offset, false);
  offset += 4;

  const fields: ContractStructField[] = [];
  for (let i = 0; i < fieldCount; i++) {
    const fDoc  = readXdrString(payload, offset); offset += fDoc.consumed;
    const fName = readXdrString(payload, offset); offset += fName.consumed;
    const fType = readXdrType(payload, offset, view); offset += fType.consumed;
    fields.push({ name: fName.value, type: fType.type, doc: fDoc.value || undefined });
  }

  return {
    entry: { name: nameResult.value, kind: 'struct', doc: docResult.value || undefined, fields },
    consumed: offset - start,
  };
}

function parseUnionEntry(
  payload: Uint8Array,
  offset: number,
  view: DataView,
): { entry: ContractTypeSpec; consumed: number } {
  const start = offset;

  const docResult  = readXdrString(payload, offset); offset += docResult.consumed;
  const nameResult = readXdrString(payload, offset); offset += nameResult.consumed;

  const variantCount = view.getUint32(offset, false);
  offset += 4;

  const variants: ContractEnumVariant[] = [];
  for (let i = 0; i < variantCount; i++) {
    const vDoc  = readXdrString(payload, offset); offset += vDoc.consumed;
    const vName = readXdrString(payload, offset); offset += vName.consumed;
    // discriminant (union kind)
    offset += 4;
    variants.push({ name: vName.value, doc: vDoc.value || undefined });
  }

  return {
    entry: { name: nameResult.value, kind: 'union', doc: docResult.value || undefined, variants },
    consumed: offset - start,
  };
}

function parseEnumEntry(
  payload: Uint8Array,
  offset: number,
  view: DataView,
): { entry: ContractTypeSpec; consumed: number } {
  const start = offset;

  const docResult  = readXdrString(payload, offset); offset += docResult.consumed;
  const nameResult = readXdrString(payload, offset); offset += nameResult.consumed;

  const variantCount = view.getUint32(offset, false);
  offset += 4;

  const variants: ContractEnumVariant[] = [];
  for (let i = 0; i < variantCount; i++) {
    const vDoc   = readXdrString(payload, offset); offset += vDoc.consumed;
    const vName  = readXdrString(payload, offset); offset += vName.consumed;
    const vValue = view.getUint32(offset, false);  offset += 4;
    variants.push({ name: vName.value, value: vValue, doc: vDoc.value || undefined });
  }

  return {
    entry: { name: nameResult.value, kind: 'enum', doc: docResult.value || undefined, variants },
    consumed: offset - start,
  };
}

// ---------------------------------------------------------------------------
// TypeScript generation helpers
// ---------------------------------------------------------------------------

/**
 * Maps a Soroban type string to its TypeScript equivalent.
 */
function sorobanTypeToTs(sorobanType: string): string {
  const map: Record<string, string> = {
    void:    'void',
    bool:    'boolean',
    u32:     'number',
    i32:     'number',
    u64:     'bigint',
    i64:     'bigint',
    u128:    'bigint',
    i128:    'bigint',
    u256:    'bigint',
    i256:    'bigint',
    Bytes:   'Uint8Array',
    String:  'string',
    Symbol:  'string',
    Address: 'string',
    error:   'Error',
  };

  if (map[sorobanType]) return map[sorobanType]!;

  if (sorobanType.startsWith('BytesN<')) return 'Uint8Array';
  if (sorobanType.startsWith('Vec'))     return 'any[]';
  if (sorobanType.startsWith('Map'))     return 'Map<any, any>';
  if (sorobanType.startsWith('Option<')) return `${sorobanType.slice(7, -1)} | null`;
  if (sorobanType.startsWith('Result<')) return sorobanType.slice(7, -1);

  // Custom (user-defined) type — use as-is; it will be declared above.
  return sorobanType;
}

/**
 * Emits a nativeToScVal call for the given argument based on its Soroban type.
 */
function scValConverterFor(sorobanType: string, argName: string): string {
  switch (sorobanType) {
    case 'Address': return `new Address(${argName}).toScVal()`;
    case 'bool':    return `xdr.ScVal.scvBool(${argName})`;
    case 'String':  return `xdr.ScVal.scvString(${argName})`;
    case 'Symbol':  return `xdr.ScVal.scvSymbol(${argName})`;
    case 'u32':     return `nativeToScVal(${argName}, { type: 'u32' })`;
    case 'i32':     return `nativeToScVal(${argName}, { type: 'i32' })`;
    case 'u64':     return `nativeToScVal(${argName}, { type: 'u64' })`;
    case 'i64':     return `nativeToScVal(${argName}, { type: 'i64' })`;
    case 'u128':    return `nativeToScVal(${argName}, { type: 'u128' })`;
    case 'i128':    return `nativeToScVal(${argName}, { type: 'i128' })`;
    default:        return `nativeToScVal(${argName})`;
  }
}

/**
 * Converts a snake_case or kebab-case contract function name to camelCase.
 */
function toCamelCase(name: string): string {
  return name.replace(/[_-]([a-z])/g, (_, c: string) => c.toUpperCase());
}
