import {
  NetworkId,
  ONE_ALPH,
  SignerProvider,
  stringToHex,
  web3,
  Contract,
  convertAlphAmountWithDecimals,
  ContractFactory,
  ContractInstance,
} from "@alephium/web3";
import { Donera, DoneraInstance, DoneraTypes } from "./contracts/donera";
import { Deployments, loadDeployments } from "./deploys";
import { CreateFund } from "./scripts";

export interface CreateFundParam {
  name: string;
  description: string;
  goal: number;
  deadline: Date;
  beneficiary: string;
}

export interface CreateFundResult {
  txId: string;
  fundContractId: string;
  name: string;
  description: string;
  goal: bigint;
  deadline: Date;
  beneficiary: string;
}

export class DoneraDapp {
  private readonly deploys: Deployments;

  constructor(deploys: Deployments) {
    this.deploys = deploys;
  }

  static forNetwork(network: NetworkId): DoneraDapp {
    return new DoneraDapp(loadDeployments(network));
  }

  public async createFund(
    signer: SignerProvider,
    params: CreateFundParam
  ): Promise<CreateFundResult> {
    const deadlineUnixTs = Math.floor(params.deadline.getTime() / 1000);
    const listingFeeCall = await this.doneraInstance.methods.getAttoListingFee();
    const attoGoal = convertAlphAmountWithDecimals(params.goal)!;
    const { txId } = await CreateFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        name: stringToHex(params.name),
        description: stringToHex(params.description),
        recipient: params.beneficiary,
        goal: attoGoal,
        deadlineTimestamp: BigInt(deadlineUnixTs),
      },
      attoAlphAmount: listingFeeCall.returns + ONE_ALPH,
    });
    const { fields } = await this.getEventForTx<DoneraTypes.FundListedEvent, DoneraInstance>(
      txId,
      Donera,
      Donera.eventIndex.FundListed
    );

    return {
      txId,
      fundContractId: fields.fundContractId,
      name: params.name,
      description: params.description,
      goal: attoGoal,
      deadline: params.deadline,
      beneficiary: params.beneficiary,
    };
  }

  private async getEventForTx<E, C extends ContractInstance>(
    txId: string,
    // needed to get the events signatures
    contractFactory: ContractFactory<C>,
    eventIndex: number
  ): Promise<E> {
    const { events } = await web3.getCurrentNodeProvider().events.getEventsTxIdTxid(txId);
    const targetEvent = events.find((e) => e.eventIndex === eventIndex);
    if (!targetEvent) {
      throw new Error(`getEventForTx: Failed to find event with index ${eventIndex} in tx ${txId}`);
    }
    return Contract.fromApiEvent(targetEvent, undefined, txId, () => contractFactory.contract) as E;
  }

  get contracts(): Deployments["contracts"] {
    return this.deploys.contracts;
  }

  get doneraInstance(): DoneraInstance {
    return this.contracts.Donera.contractInstance;
  }
}
