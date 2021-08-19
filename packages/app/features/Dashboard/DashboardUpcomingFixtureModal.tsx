import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Grid,
} from "@chakra-ui/react";
import { DashboardFixture } from "@open-fpl/app/features/Dashboard/dashboardTypes";

const nth = function (d: number) {
  if (d > 3 && d < 21) return `${d}th`;
  switch (d % 10) {
    case 1:
      return `${d}st`;
    case 2:
      return `${d}nd`;
    case 3:
      return `${d}rd`;
    default:
      return `${d}th`;
  }
};

const DashboardUpcomingFixtureModal = ({
  isOpen,
  onClose,
  fixture,
  kickoffTime,
  homeDisplayPercent,
  awayDisplayPercent,
}: {
  isOpen: boolean;
  onClose: () => void;
  fixture: DashboardFixture;
  kickoffTime: string;
  homeDisplayPercent: number;
  awayDisplayPercent: number;
}) => {
  return (
    <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader />
        <DrawerCloseButton />
        <DrawerBody>
          <Box textAlign="center" layerStyle="subtitle" my={4}>
            {kickoffTime}
          </Box>
          <Flex
            my={4}
            flexGrow={1}
            width="100%"
            fontWeight="black"
            fontSize="xl"
          >
            <Box
              py={1}
              px={2}
              layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
            >
              {fixture.team_h?.short_name}
            </Box>
            <Flex alignItems="stretch" flexGrow={1} mx="-1px">
              <Box
                width={`${homeDisplayPercent}%`}
                layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
              />
              <Box width="4px" layerStyle="sticky" />
              <Box
                width={`${awayDisplayPercent}%`}
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
              />
            </Flex>
            <Box
              py={1}
              px={2}
              layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
            >
              {fixture.team_a?.short_name}
            </Box>
          </Flex>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <Stat textAlign="center">
              <StatLabel>Position</StatLabel>
              <StatNumber>
                {nth(fixture.team_h?.stats?.position ?? 0)}
              </StatNumber>
              <StatHelpText>
                xPosition: {nth(fixture.team_h?.stats?.xposition ?? 0)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Position</StatLabel>
              <StatNumber>
                {nth(fixture.team_a?.stats?.position ?? 0)}
              </StatNumber>
              <StatHelpText>
                xPosition: {nth(fixture.team_a?.stats?.xposition ?? 0)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>W-D-L</StatLabel>
              <StatNumber>
                {fixture.team_h?.stats?.wins ?? 0}-
                {fixture.team_h?.stats?.draws ?? 0}-
                {fixture.team_h?.stats?.loses ?? 0}
              </StatNumber>
              <StatHelpText>
                {fixture.team_h?.stats?.matches.map((m, index) => (
                  <Box
                    key={index}
                    as="span"
                    layerStyle={
                      m.result === "w"
                        ? "green"
                        : m.result === "l"
                        ? "red"
                        : undefined
                    }
                  >
                    {m.result.toUpperCase()}
                  </Box>
                ))}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>W-D-L</StatLabel>
              <StatNumber>
                {fixture.team_a?.stats?.wins ?? 0}-
                {fixture.team_a?.stats?.draws ?? 0}-
                {fixture.team_a?.stats?.loses ?? 0}
              </StatNumber>
              <StatHelpText>
                {fixture.team_a?.stats?.matches.map((m, index) => (
                  <Box
                    key={index}
                    as="span"
                    layerStyle={
                      m.result === "w"
                        ? "green"
                        : m.result === "l"
                        ? "red"
                        : undefined
                    }
                  >
                    {m.result.toUpperCase()}
                  </Box>
                ))}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Goals</StatLabel>
              <StatNumber>{fixture.team_h?.stats?.g}</StatNumber>
              <StatHelpText>
                xG:
                {fixture.team_h?.stats?.xg.toFixed(2)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Goals</StatLabel>
              <StatNumber>{fixture.team_a?.stats?.g}</StatNumber>
              <StatHelpText>
                xG:
                {fixture.team_a?.stats?.xg.toFixed(2)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Conceded</StatLabel>
              <StatNumber>{fixture.team_h?.stats?.ga}</StatNumber>
              <StatHelpText>
                xGA:
                {fixture.team_h?.stats?.xga.toFixed(2)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Conceded</StatLabel>
              <StatNumber>{fixture.team_a?.stats?.ga}</StatNumber>
              <StatHelpText>
                xGA:
                {fixture.team_a?.stats?.xga.toFixed(2)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Attack</StatLabel>
              <StatNumber>
                {fixture.team_h?.strength_attack_home.toLocaleString()}
              </StatNumber>
              <StatHelpText>Strength</StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Attack</StatLabel>
              <StatNumber>
                {fixture.team_a?.strength_attack_away.toLocaleString()}
              </StatNumber>
              <StatHelpText>Strength</StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Defence</StatLabel>
              <StatNumber>
                {fixture.team_h?.strength_defence_home.toLocaleString()}
              </StatNumber>
              <StatHelpText>Strength</StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Defence</StatLabel>
              <StatNumber>
                {fixture.team_a?.strength_defence_away.toLocaleString()}
              </StatNumber>
              <StatHelpText>Strength</StatHelpText>
            </Stat>
          </Grid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DashboardUpcomingFixtureModal;

{
  /* <Flex
            px={{ base: 1, sm: 4 }}
            my={2}
            flexGrow={1}
            width="100%"
            justifyContent="space-around"
            fontSize="sm"
          >
            <Box flexBasis="50%">
              <Stack spacing={0.5} direction="row" layerStyle="subtitle">
                <Text noOfLines={1}>Name</Text>
                <Text>·</Text>
                <Text>Pts.</Text>
              </Stack>
              {fixture.team_h_players.map((s) => (
                <Stack
                  spacing={0.5}
                  key={s.player.id}
                  direction="row"
                  layerStyle={s.picked ? "brand" : undefined}
                >
                  <Text noOfLines={1}>{s.player.web_name}</Text>
                  <Text>·</Text>
                  <Text>{s.player.total_points}</Text>
                </Stack>
              ))}
            </Box>
            <Box flexBasis="50%">
              <Stack
                spacing={0.5}
                direction="row-reverse"
                layerStyle="subtitle"
              >
                <Text noOfLines={1}>Name</Text>
                <Text>·</Text>
                <Text>Pts.</Text>
              </Stack>
              {fixture.team_a_players.map((s) => (
                <Stack
                  spacing={0.5}
                  key={s.player.id}
                  direction="row-reverse"
                  layerStyle={s.picked ? "brand" : undefined}
                >
                  <Text noOfLines={1}>{s.player.web_name}</Text>
                  <Text>·</Text>
                  <Text>{s.player.total_points}</Text>
                </Stack>
              ))}
            </Box>
          </Flex> */
}
