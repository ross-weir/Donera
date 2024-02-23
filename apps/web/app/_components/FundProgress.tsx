import { prettifyAttoAlphAmount } from "@alephium/web3";
import { Progress, ProgressProps, Text, TextProps } from "@mantine/core";

export type FundProgressProps = {
  raised: string;
  goal: string;
  // relative to progress bar
  textPosition?: "above" | "below";
  showTarget?: boolean;
  labelProps?: TextProps;
  progressProps?: Partial<ProgressProps>;
};

export function FundProgress({
  textPosition = "above",
  showTarget = true,
  raised,
  goal,
  labelProps = {},
  progressProps = {},
}: FundProgressProps) {
  const progress = Number((BigInt(raised) * BigInt(100)) / BigInt(goal));
  const text = (
    <Text {...labelProps}>
      {prettifyAttoAlphAmount(raised)} ALPH{" "}
      {showTarget ? (
        <Text span c="dimmed" size="xs">
          raised of {prettifyAttoAlphAmount(goal)} target
        </Text>
      ) : (
        <Text span size="sm">
          raised
        </Text>
      )}
    </Text>
  );

  return (
    <>
      {textPosition === "above" && text}
      <Progress {...progressProps} value={progress} color="green" />
      {textPosition === "below" && text}
    </>
  );
}
