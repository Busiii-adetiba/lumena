import { describe, it, expect } from "vitest";
import { Sep41Token } from "../stellar/sep41.js";
import { Keypair, nativeToScVal, xdr } from "@stellar/stellar-sdk";
import { StellarClient } from "../stellar/client.js";

describe("Sep41Token", () => {
  const contractId = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM";
  const dummyClient = new StellarClient({ network: "testnet" });

  describe("Constructor", () => {
    it("initializes with contractId and optional client", () => {
      const token = new Sep41Token(contractId, dummyClient);
      expect(token.contractId).toBe(contractId);
      expect(token.client).toBe(dummyClient);
    });

    it("initializes with client and contractId order", () => {
      const token = new Sep41Token(dummyClient, contractId);
      expect(token.contractId).toBe(contractId);
      expect(token.client).toBe(dummyClient);
    });
  });

  describe("Argument Encoding & Operation Building", () => {
    const fromAddr = Keypair.random().publicKey();
    const toAddr = Keypair.random().publicKey();

    it("encodes buildBalanceOperation correctly", () => {
      const token = new Sep41Token(contractId);
      const op = token.buildBalanceOperation(fromAddr);

      expect(op.body().switch()).toBe(xdr.OperationType.invokeHostFunction());
    });

    it("encodes transfer arguments correctly", () => {
      const token = new Sep41Token(contractId);
      const op = token.transfer(fromAddr, toAddr, "1000000");

      expect(op.body().switch()).toBe(xdr.OperationType.invokeHostFunction());
    });

    it("encodes approve arguments correctly", () => {
      const token = new Sep41Token(contractId);
      const op = token.approve(fromAddr, toAddr, "5000000", 123456);

      expect(op.body().switch()).toBe(xdr.OperationType.invokeHostFunction());
    });
  });

  describe("Response Parsing", () => {
    it("parses xdr.ScVal i128 response", () => {
      const scVal = nativeToScVal(123456789n, { type: "i128" });
      const parsed = Sep41Token.parseBalanceResponse(scVal);
      expect(parsed).toBe(123456789n);
    });

    it("parses simulation result object", () => {
      const scVal = nativeToScVal(999n, { type: "i128" });
      const simResult = {
        result: {
          retval: scVal,
        },
      };
      const parsed = Sep41Token.parseBalanceResponse(simResult);
      expect(parsed).toBe(999n);
    });

    it("handles fallback and null values", () => {
      expect(Sep41Token.parseBalanceResponse(null)).toBe(0n);
      expect(Sep41Token.parseBalanceResponse("500")).toBe(500n);
      expect(Sep41Token.parseBalanceResponse(100)).toBe(100n);
    });
  });
});
