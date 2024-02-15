import { NetworkId, ONE_ALPH, SignerProvider, stringToHex } from "@alephium/web3";
import { DoneraInstance } from "./contracts/donera";
import { Deployments, loadDeployments } from "./deploys";
import { CreateFund } from "./scripts";

export interface CreateFundParam {
  name: string;
  description: string;
  goal: number;
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

  public async createFund(signer: SignerProvider, param: CreateFundParam): Promise<string> {
    const deadlineUnixTs = Math.floor(param.deadline.getTime() / 1000);
    const listingFeeCall = await this.doneraInstance.methods.getAttoListingFee();
    const result = await CreateFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        name: stringToHex(param.name),
        description: stringToHex(param.description),
        recipient: param.beneficiary,
        goal: BigInt(param.goal),
        deadlineTimestamp: BigInt(deadlineUnixTs),
      },
      attoAlphAmount: listingFeeCall.returns + ONE_ALPH,
    });

    return result.txId;
  }

  get doneraInstance(): DoneraInstance {
    return this.deploys.contracts.Donera.contractInstance;
  }
}
