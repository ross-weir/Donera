import {
  NetworkId,
  ONE_ALPH,
  SignerProvider,
  web3,
  Contract,
  convertAlphAmountWithDecimals,
  ContractFactory,
  ContractInstance,
  convertAmountWithDecimals,
  ALPH_TOKEN_ID,
  subContractId,
} from "@alephium/web3";
import { ALPH, TokenInfo } from "@alephium/token-list";
import {
  DeriveFundPathParam,
  Donera,
  DoneraInstance,
  DoneraTypes,
  deriveFundContractPath,
} from "./contracts/donera";
import { Deployments, loadDeployments } from "./deploys";
import { CreateFund, DonateToFund, FinalizeFund } from "./scripts";
import { getTokensForNetwork } from "./tokens";
import { stringToHex } from "@donera/core";
import { NO_UI_FEE, UiFee, UiFeeOnchain, convertUiFeeToOnchain } from "./fees";

export type CreateFundParam = {
  name: string;
  description: string;
  goal: number | string;
  deadline: Date;
  beneficiary: string;
};

export type CreateFundResult = {
  txId: string;
  fundContractId: string;
  name: string;
  description: string;
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
    const listingFeeCall = await this.doneraInstance.methods.getAttoListingFee();
    const onchainParams = {
      name: stringToHex(params.name),
      goal: convertAlphAmountWithDecimals(params.goal)!,
      beneficiary: params.beneficiary,
      deadlineTimestamp: BigInt(deadlineUnixTs),
    };
    const { txId } = await CreateFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        ...this.uiFee,
        description: stringToHex(params.description),
        ...onchainParams,
      },
      attoAlphAmount: listingFeeCall.returns + ONE_ALPH + this.uiFee.uiFee,
    });
    const { fields } = await this.getEventForTx<DoneraTypes.FundListedEvent, DoneraInstance>(
      txId,
      Donera,
      Donera.eventIndex.FundListed
    );

    // TODO: should probably return the values in `fields` as they come from
    // the blockchain itself
    return {
      txId,
      fundContractId: fields.fundContractId,
      name: params.name,
      description: params.description,
      goal: onchainParams.goal.toString(),
      deadline: params.deadline,
      beneficiary: params.beneficiary,
      organizer: fields.organizer,
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

    const donateAmount = convertAmountWithDecimals(amount, tokenInfo.decimals)!;
    const { txId } = await DonateToFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        ...this.uiFee,
        fundContractId,
        tokenId,
        amount: donateAmount,
      },
      attoAlphAmount: donateAmount + this.uiFee.uiFee,
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

  public deriveFundContractId(param: DeriveFundPathParam, organizer: string): string {
    return subContractId(
      this.doneraInstance.contractId,
      deriveFundContractPath({ ...param, organizer }),
      this.doneraInstance.groupIndex
    );
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
