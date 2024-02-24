import { validateAddress } from "@alephium/web3";
import { DoneraTypes } from "@donera/dapp/contracts";
import { z } from "zod";

const filterSchema = z.object({
  listing: z.array(z.function()).optional(),
  donation: z.array(z.function()).optional(),
  finalization: z.array(z.function()).optional(),
});

export const discordIntegrationSchema = z.object({});
export type DiscordIntegrationConfig = z.infer<typeof discordIntegrationSchema>;

const integrationsSchema = z.object({
  discord: discordIntegrationSchema.optional(),
});

export const doneraIntegrationSchema = z.object({
  // contract address of the deployed donera instance
  donera: z.string().superRefine((val, ctx) => {
    try {
      validateAddress(val);
    } catch (e: unknown) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: (e as Error).message,
      });
    }
  }),
  integrations: integrationsSchema,
  filters: filterSchema.optional(),
});

type InferredConfig = z.infer<typeof doneraIntegrationSchema>;

export type DoneraIntegrationConfig = {
  donera: InferredConfig["donera"];
  integrations: InferredConfig["integrations"];
  // This instead of zod infer so we can get strong typing on filter callbacks
  filters?: {
    listing?: Array<(event: DoneraTypes.FundListedEvent) => Promise<true>>;
    donation?: Array<(event: DoneraTypes.DonationEvent) => Promise<true>[]>;
    finalization?: Array<(event: DoneraTypes.FundFinalizedEvent) => Promise<true>[]>;
  };
};
