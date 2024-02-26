import { Button, Divider, Modal, ModalProps, Text } from "@mantine/core";
import classes from "./DisconnectModal.module.css";

export type DisconnectModalProps = {
  onDisconnect: () => void;
} & ModalProps;

export function DisconnectModal({ onDisconnect, opened, onClose, ...rest }: DisconnectModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Are you sure you want to disconnect your wallet?"
      centered
      {...rest}
    >
      <Text>You can reconnect at any time</Text>
      <Divider my="lg" />
      <div className={classes.disconnectWrapper}>
        <Button onClick={onDisconnect} color="red">
          Disconnect
        </Button>
      </div>
    </Modal>
  );
}
