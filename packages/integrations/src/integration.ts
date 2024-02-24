import { DoneraTypes } from "@donera/dapp/contracts";

export interface Integration {
  onFundListed(event: DoneraTypes.FundListedEvent): Promise<void>;
  onDonation(event: DoneraTypes.DonationEvent): Promise<void>;
  onFundFinalization(event: DoneraTypes.FundFinalizedEvent): Promise<void>;
}
