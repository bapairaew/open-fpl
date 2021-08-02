import {
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  Link as A,
  Text,
  VStack,
  Flex,
} from "@chakra-ui/react";
import {
  IoEllipsisVerticalOutline,
  IoReorderFourOutline,
} from "react-icons/io5";
import { difficultyColorCodes } from "@open-fpl/data/features/RemoteData/fplColors";

const DifficultyColorCodes = () => (
  <VStack spacing={3} alignItems="flex-start">
    <Heading as="h2" size="md">
      Difficulty Color Codes
    </Heading>
    <HStack
      spacing={0}
      fontSize={{ base: "xs", sm: "md" }}
      alignItems="stretch"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        p={1}
        width={{ base: "60px", sm: "100px" }}
        textAlign="center"
        bgColor={difficultyColorCodes[1].background}
        color={difficultyColorCodes[1].text}
      >
        Very Easy
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        p={1}
        width={{ base: "60px", sm: "100px" }}
        textAlign="center"
        bgColor={difficultyColorCodes[2].background}
        color={difficultyColorCodes[2].text}
      >
        Easy
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        p={1}
        width={{ base: "60px", sm: "100px" }}
        textAlign="center"
        bgColor={difficultyColorCodes[3].background}
        color={difficultyColorCodes[3].text}
      >
        Normal
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        p={1}
        width={{ base: "60px", sm: "100px" }}
        textAlign="center"
        bgColor={difficultyColorCodes[4].background}
        color={difficultyColorCodes[4].text}
      >
        Hard
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        p={1}
        width={{ base: "60px", sm: "100px" }}
        textAlign="center"
        bgColor={difficultyColorCodes[5].background}
        color={difficultyColorCodes[5].text}
      >
        Very Hard
      </Flex>
    </HStack>
  </VStack>
);

const FixturesHelp = () => {
  return (
    <Container maxW="container.lg" lineHeight="taller">
      <VStack spacing={6} alignItems="flex-start">
        <Heading as="h1" size="xl" fontWeight="black">
          Fixture Difficulty Rating
        </Heading>
        <Text as="p">
          Fixture Difficulty Rating here is slightly different from{" "}
          <A
            color="brand.500"
            isExternal
            href="https://fantasy.premierleague.com/fixtures/fdr"
          >
            FPL Fixture Difficulty Rating
          </A>{" "}
          but it is still relied on that data from FPL.{" "}
          <strong>Open FPL</strong> Fixture Difficulty Rating is calculated from
          teams home/away attack/defence strength provided by FPL.
        </Text>

        <DifficultyColorCodes />

        <Heading as="h2" size="lg" fontWeight="black">
          Team Strength
        </Heading>
        <Text as="p">
          Each team is assigned with strengh in attack and defence in both home
          and away separately. This value is provided by FPL API but if you
          disagree with these values you can change them in Edit Teams Strength
          Pannel.
        </Text>

        <Heading as="h3" size="md" fontWeight="black">
          Editing Team Strength
        </Heading>
        <Text as="p">
          Simply click "Edit Teams Strength" on the top right of the page. The
          pannel will show up and allow you edit each team strength using a
          slider. Once you edit the strength, the strength of the particular
          aspect of that team will no longer synced with Offical FPL. You can
          always click "Reset" button to go back to the default settings. Once
          you are done, the Fixtures Difficulty Rating table will automatically
          update with the strength values.
        </Text>

        <Heading as="h2" size="lg" fontWeight="black">
          Rearranging Team Fixtures
        </Heading>
        <Text as="p">
          In order to make it easier for you to compare Fixtures Difficulty
          Rating between teams, the table allow you to rearrange the rows by
          simply dragging the{" "}
          <Icon aria-label="rearrange" as={IoReorderFourOutline} /> icon at the
          first column with the team short name.
        </Text>
        <Text as="p">
          Alternatively, you can sort the table based on each week difficulty by
          clicking on the{" "}
          <Icon aria-label="menu" as={IoEllipsisVerticalOutline} /> menu button
          at the header row besides each gameweek and choose a sort option that
          you like.
        </Text>
      </VStack>
    </Container>
  );
};

export default FixturesHelp;
