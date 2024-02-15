import { Container } from "@mantine/core";
import classes from "./layout.module.css";

export default function CreateFundLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className={classes.container} size={700}>
      {children}
    </Container>
  );
}
