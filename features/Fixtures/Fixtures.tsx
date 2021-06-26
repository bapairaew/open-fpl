import {
  Box,
  Divider,
  Heading,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { IoHelpCircleOutline } from "react-icons/io5";
import AutoSizer from "react-virtualized-auto-sizer";
import { difficultyColorCodes } from "~/features/AppData/fplColors";
import { Team } from "~/features/AppData/fplTypes";
import { makeFullFixtures } from "~/features/Fixtures/fixturesData";
import { TeamFixtures } from "~/features/Fixtures/fixturesDataTypes";

const Fixtures = ({
  teamFixtures,
  fplTeams,
}: {
  teamFixtures: TeamFixtures[];
  fplTeams: Team[];
}) => {
  const fullFixtures = useMemo(() => {
    return makeFullFixtures({ teamFixtures, fplTeams });
  }, [teamFixtures, fplTeams]);

  const [mode, setMode] = useState("attack");

  return (
    <Box overflow="hidden" height="100%">
      <HStack alignItems="center" height="50px" borderBottomWidth={1}>
        <Heading fontWeight="black" fontSize="lg" px={4}>
          Fixtures Difficulty Rating
          <Tooltip
            hasArrow
            label="Fixture Difficulty Rating is calculated by teams' home/away attack/defence strength provided by FPL."
          >
            <span>
              <Icon ml={2} aria-label="help" as={IoHelpCircleOutline} />
            </span>
          </Tooltip>
        </Heading>
        <Divider orientation="vertical" />
        <RadioGroup px={4} value={mode} onChange={setMode}>
          <Stack spacing={5} direction="row">
            <Radio value="attack">Attack</Radio>
            <Radio value="defence">Defence</Radio>
          </Stack>
        </RadioGroup>
        <Divider orientation="vertical" />
      </HStack>

      <AutoSizer>
        {({ height, width }) => (
          <Table
            variant="simple"
            colorScheme="gray"
            display="block"
            overflow="auto"
            height={`${height - 50}px`}
            width={`${width}px`}
          >
            <Thead position="sticky" top={0} zIndex="sticky">
              <Tr>
                <Th
                  textAlign="center"
                  position="sticky"
                  left={0}
                  bgColor="white"
                >
                  Team
                </Th>
                {Array.from({ length: 38 }).map((_, i) => (
                  <Th textAlign="center" key={i} bgColor="white">
                    <Box width="45px">GW {i + 1}</Box>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {fullFixtures.map((team) => (
                <Tr key={team.short_name}>
                  <Td
                    position="sticky"
                    left={0}
                    fontWeight="black"
                    bgColor="white"
                    textAlign="center"
                  >
                    {team.short_name}
                  </Td>
                  {team.fixtures.map((fixture) => {
                    const difficulty =
                      mode === "attack"
                        ? fixture.attack_difficulty
                        : fixture.defence_difficulty;
                    const { background, text } =
                      difficulty !== null
                        ? difficultyColorCodes[difficulty]
                        : { background: undefined, text: undefined };
                    return (
                      <Td textAlign="center" bg={background} color={text}>
                        {fixture.is_home
                          ? fixture.opponent_short_name.toUpperCase()
                          : fixture.opponent_short_name.toLocaleLowerCase()}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </AutoSizer>
    </Box>
  );
};

export default Fixtures;
