import {
  Operation,
  TransactionBuilder,
  Transaction,
  Account,
  BASE_FEE,
  xdr,
  rpc,
} from "@stellar/stellar-sdk";
import type {
  ContractInvocation,
  ContractSimulationResult,
} from "@lumen/types";
import type { StellarClient } from "../stellar/client.js";
import { toScVal, fromScVal } from "./scval.js";

export class ContractClient {
  readonly client: StellarClient;

  constructor(client: StellarClient) {
    this.client = client;
  }

  /**
   * Converts a ContractInvocation into an xdr.Operation.
   */
  buildInvocationOperation(invocation: ContractInvocation): xdr.Operation {
    const scValArgs: xdr.ScVal[] = (invocation.args ?? []).map((arg) =>
      toScVal(arg)
    );

    return Operation.invokeContractFunction({
      contract: invocation.contractId,
      function: invocation.method,
      args: scValArgs,
    });
  }

  /**
   * Simulates a Soroban contract invocation without submitting it to the network.
   */
  async simulate(
    invocation: ContractInvocation,
    sourceAddress?: string
  ): Promise<ContractSimulationResult> {
    const source = sourceAddress ?? "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    const dummyAccount = new Account(source, "0");
    const op = this.buildInvocationOperation(invocation);

    const tx = new TransactionBuilder(dummyAccount, {
      fee: BASE_FEE,
      networkPassphrase: this.client.networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(180)
      .build();

    const simResponse = await this.client.rpc.simulateTransaction(tx);
    const sim = simResponse as any;
    const isSuccess =
      rpc.Api.isSimulationSuccess(simResponse) || (sim && sim.result?.retval !== undefined);

    if (isSuccess) {
      const retval = sim.result?.retval;
      return {
        successful: true,
        returnValue: retval ? fromScVal(retval) : undefined,
        minResourceFee: sim.minResourceFee?.toString(),
        cpuInstructions: sim.cost?.cpuInsns ? Number(sim.cost.cpuInsns) : undefined,
        memoryBytes: sim.cost?.memBytes ? Number(sim.cost.memBytes) : undefined,
      };
    }

    return {
      successful: false,
      error: sim?.error ?? sim?.result?.error ?? "Simulation failed",
    };
  }

  /**
   * Builds and simulates a prepared Soroban contract transaction ready for signing.
   */
  async buildTransaction(opts: {
    sourceAddress: string;
    invocation: ContractInvocation;
    fee?: string;
    timeoutSeconds?: number;
  }): Promise<Transaction> {
    const account = await this.client.horizon.loadAccount(opts.sourceAddress);
    const op = this.buildInvocationOperation(opts.invocation);

    const tx = new TransactionBuilder(account, {
      fee: opts.fee ?? BASE_FEE,
      networkPassphrase: this.client.networkPassphrase,
    })
      .addOperation(op)
      .setTimeout(opts.timeoutSeconds ?? 180)
      .build();

    return (await this.client.rpc.prepareTransaction(tx)) as Transaction;
  }
}
