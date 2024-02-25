import { DoneraIntegrationConfig, doneraIntegrationSchema } from "@donera/integrations";
import { validateAddress, networkIds } from "@alephium/web3";
import { z } from "zod";

export const doneraConfigSchema = z.object({
  networkId: z.enum(networkIds),
  doneraAddress: z
    .string()
    .superRefine((val, ctx) => {
      try {
        validateAddress(val);
      } catch (e: unknown) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: (e as Error).message,
        });
      }
    })
    .optional(),
  integrations: doneraIntegrationSchema.optional(),
});

// override `integrations` with strongly defined type
export type DoneraConfig = Omit<z.infer<typeof doneraConfigSchema>, "integrations"> & {
  integrations?: DoneraIntegrationConfig;
};
