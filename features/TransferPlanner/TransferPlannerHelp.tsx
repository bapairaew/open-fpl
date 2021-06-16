import { Text, Container, Heading } from "@chakra-ui/react";

const TransferPlannerHelp = () => {
  return (
    <Container my={4}>
      <Heading as="h1" size="lg" fontWeight="black">
        Transfer Planner
      </Heading>
      <Text my={4} as="p">
        Transfer Planner is where you plan your transfer for upcoming gameweeks.
      </Text>
      <Text my={4} as="p">
        It is still work-in-progress.
      </Text>
    </Container>
  );
};

export default TransferPlannerHelp;
