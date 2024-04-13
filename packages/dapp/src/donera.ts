import {
  NetworkId,
  ONE_ALPH,
  SignerProvider,
  convertAlphAmountWithDecimals,
  convertAmountWithDecimals,
  ALPH_TOKEN_ID,
  subContractId,
} from "@alephium/web3";
import { ALPH, TokenInfo } from "@alephium/token-list";
import { DeriveFundPathParam, DoneraInstance, deriveFundContractPath } from "./contracts/donera";
import { Deployments, loadDeployments } from "./deploys";
import { CreateFund, DonateToFund, FinalizeFund } from "./scripts";
import { getTokensForNetwork } from "./tokens";
import { stringToHex } from "@donera/core";
import { NO_UI_FEE, UiFee, UiFeeOnchain, convertUiFeeToOnchain } from "./fees";

export type CreateFundParam = {
  metadataUrl: string;
  goal: number | string;
  deadline: Date;
  beneficiary: string;
};

export type CreateFundResult = {
  txId: string;
  fundContractId: string;
  metadataUrl: string;
  goal: string;
  deadline: Date;
  beneficiary: string;
  organizer: string;
};

export type DonateToFundParam = {
  fundContractId: string;
  tokenId: string;
  amount: number | string;
};

export type DonateToFundResult = {
  txId: string;
};

export type FinalizeFundParam = {
  fundContractId: string;
};

export type FinalizeFundResult = {
  txId: string;
};

/**
 * Donera Facade
 *
 * This class is intended to hide implementation details
 * associated with TxScripts and conversion to/from onchain
 * and offchain types. It should make working with the donera
 * protocol more convienent.
 */
export class DoneraDapp {
  private readonly uiFee: UiFeeOnchain;
  private readonly tokens: TokenInfo[];
  private readonly deploys: Deployments;

  constructor(networkId: NetworkId, deploys: Deployments, uiFee?: UiFee) {
    this.uiFee = uiFee ? convertUiFeeToOnchain(uiFee) : NO_UI_FEE;
    this.tokens = getTokensForNetwork(networkId);
    this.deploys = deploys;
  }

  static forNetwork(network: NetworkId, uiFee?: UiFee): DoneraDapp {
    return new DoneraDapp(network, loadDeployments(network), uiFee);
  }

  public async createFund(
    signer: SignerProvider,
    params: CreateFundParam
  ): Promise<CreateFundResult> {
    const deadlineUnixTs = Math.floor(params.deadline.getTime() / 1000);
    const listingFeeCall = await this.doneraInstance.methods.getListingFee();
    const onchainParams = {
      metadataUrl: stringToHex(params.metadataUrl),
      goal: convertAlphAmountWithDecimals(params.goal)!,
      beneficiary: params.beneficiary,
      deadlineTimestamp: BigInt(deadlineUnixTs),
    };
    const { txId } = await CreateFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        ...this.uiFee,
        ...onchainParams,
      },
      attoAlphAmount: listingFeeCall.returns + ONE_ALPH + this.uiFee.uiFee,
    });
    const organizerAccount = await signer.getSelectedAccount();
    const fundContractId = this.deriveFundContractId({
      ...onchainParams,
      organizer: organizerAccount.address,
    });

    return {
      txId,
      fundContractId,
      metadataUrl: params.metadataUrl,
      goal: onchainParams.goal.toString(),
      deadline: params.deadline,
      beneficiary: params.beneficiary,
      organizer: organizerAccount.address,
    };
  }

  public async donateToFund(
    signer: SignerProvider,
    { fundContractId, tokenId, amount }: DonateToFundParam
  ): Promise<DonateToFundResult> {
    const tokenInfo = this.getTokenInfo(tokenId);

    if (!tokenInfo) {
      throw new Error(`Only verified tokens can be donated, tokenId ${tokenId} is not verified`);
    }

    const donationFee = await this.doneraInstance.methods.getDonationFee();
    const donateAmount = convertAmountWithDecimals(amount, tokenInfo.decimals)!;
    const { txId } = await DonateToFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        ...this.uiFee,
        fundContractId,
        tokenId,
        amount: donateAmount,
      },
      attoAlphAmount: donateAmount + this.uiFee.uiFee + donationFee.returns,
    });

    return { txId };
  }

  public async finalizeFund(
    signer: SignerProvider,
    { fundContractId }: FinalizeFundParam
  ): Promise<FinalizeFundResult> {
    const { txId } = await FinalizeFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        ...this.uiFee,
        fundContractId,
      },
      attoAlphAmount: this.uiFee.uiFee,
    });

    return { txId };
  }

  public deriveFundContractId(param: DeriveFundPathParam): string {
    return subContractId(
      this.doneraInstance.contractId,
      deriveFundContractPath(param),
      this.doneraInstance.groupIndex
    );
  }

  private getTokenInfo(tokenId: string): TokenInfo | undefined {
    if (tokenId === ALPH_TOKEN_ID) {
      return ALPH;
    }
    return this.tokens.find((t) => t.id === tokenId);
  }

  get contracts(): Deployments["contracts"] {
    return this.deploys.contracts;
  }

  get doneraInstance(): DoneraInstance {
    return this.contracts.Donera.contractInstance;
  }
}
