import { DoneraTypes } from "@donera/dapp/contracts";
import { z } from "zod";

const filterSchema = z.object({
  listing: z.array(z.function()).optional(),
  donation: z.array(z.function()).optional(),
  finalization: z.array(z.function()).optional(),
});

export const discordIntegrationSchema = z.object({});
export type DiscordIntegrationConfig = z.infer<typeof discordIntegrationSchema>;

const servicesIntegrationsSchema = z.object({
  discord: discordIntegrationSchema.optional(),
});

export const doneraIntegrationSchema = z.object({
  services: servicesIntegrationsSchema,
  filters: filterSchema.optional(),
});

type InferredConfig = z.infer<typeof doneraIntegrationSchema>;

export type DoneraIntegrationConfig = {
  services: InferredConfig["services"];
  // This instead of zod infer so we can get strong typing on filter callbacks
  filters?: {
    listing?: Array<(event: DoneraTypes.FundListedEvent) => Promise<boolean>>;
    donation?: Array<(event: DoneraTypes.DonationEvent) => Promise<boolean>>;
    finalization?: Array<(event: DoneraTypes.FundFinalizedEvent) => Promise<boolean>>;
  };
};
