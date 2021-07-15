import { Text, Container, Heading } from "@chakra-ui/react";

const TeamPlannerHelp = () => {
  return (
    <Container maxW="container.lg" my={6}>
      <Heading as="h1" size="xl" fontWeight="black">
        Team Planner
      </Heading>
      <Text my={6} as="p">
        Team Planner is where you plan your team lineup, transfer, chip usage,
        and captain strategy for upcoming gameweeks. It also supports adding
        your own custom players for your most anticipated players coming into
        your teams!
      </Text>

      <Heading my={6} as="h2" size="lg" fontWeight="black">
        Set up your team profile
      </Heading>
      <Text my={6} as="p">
        ...
      </Text>

      <Heading my={6} as="h2" size="lg" fontWeight="black">
        Lineup planning
      </Heading>
      <Text my={6} as="p">
        ...
      </Text>

      <Heading my={6} as="h2" size="lg" fontWeight="black">
        Transfer planning
      </Heading>
      <Text my={6} as="p">
        ...
      </Text>

      <Heading my={6} as="h2" size="lg" fontWeight="black">
        Chip Usage
      </Heading>
      <Text my={6} as="p">
        ...
      </Text>

      <Heading my={6} as="h2" size="lg" fontWeight="black">
        Captain planning
      </Heading>
      <Text my={6} as="p">
        ...
      </Text>

      <Heading my={6} as="h2" size="lg" fontWeight="black">
        Summary View
      </Heading>
      <Text my={6} as="p">
        ...
      </Text>

      <Heading my={6} as="h2" size="lg" fontWeight="black">
        Custom players
      </Heading>
      <Text my={6} as="p">
        ...
      </Text>
    </Container>
  );
};

export default TeamPlannerHelp;
