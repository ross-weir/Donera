import { Container } from "@mantine/core";

export default function CreateFundLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container pt="xl" size={500}>
      {children}
    </Container>
  );
}
