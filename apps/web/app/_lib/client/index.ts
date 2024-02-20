import { notifications } from "@mantine/notifications";

export function handleTxSubmitError(e: Error, operation: string) {
  // does this ONLY occur if the user clicks "cancel" in their wallet?
  if (e.message === "User abort") {
    notifications.show({
      title: `${operation} aborted`,
      message: "No transaction was submitted to the network",
    });
  } else {
    console.error(e);
    notifications.show({
      title: "An error occurred",
      message: "Please try again soon.",
      color: "red",
      icon: "❌",
    });
  }
}
