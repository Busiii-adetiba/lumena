export type ScValType =
  | "bool"
  | "u32"
  | "i32"
  | "u64"
  | "i64"
  | "u128"
  | "i128"
  | "u256"
  | "i256"
  | "symbol"
  | "string"
  | "address"
  | "bytes";

export interface ContractArg {
  value: any;
  type?: ScValType;
}

export interface ContractInvocation {
  contractId: string;
  method: string;
  args?: (ContractArg | any)[];
}

export interface ContractSimulationResult {
  successful: boolean;
  returnValue?: any;
  minResourceFee?: string;
  cpuInstructions?: number;
  memoryBytes?: number;
  error?: string;
}
