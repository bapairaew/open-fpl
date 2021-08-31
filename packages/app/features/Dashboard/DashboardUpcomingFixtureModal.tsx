import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
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
          <Box
            textAlign="center"
            layerStyle="subtitle"
            my={4}
            aria-label="kick-off time"
          >
            {kickoffTime}
          </Box>
          <Flex
            as="section"
            aria-label="teams"
            my={4}
            flexGrow={1}
            width="100%"
            fontWeight="black"
            fontSize="xl"
          >
            <Box
              aria-label="home team"
              py={1}
              px={2}
              layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
            >
              {fixture.team_h?.short_name}
            </Box>
            <Flex
              alignItems="stretch"
              flexGrow={1}
              mx="-1px"
              aria-label="teams strength"
            >
              <Box
                aria-label="home team strength"
                aria-valuetext={`${homeDisplayPercent}`}
                width={`${homeDisplayPercent}%`}
                layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
              />
              <Box width="4px" />
              <Box
                aria-label="away team strength"
                aria-valuetext={`${awayDisplayPercent}`}
                width={`${awayDisplayPercent}%`}
                layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
              />
            </Flex>
            <Box
              aria-label="away team"
              py={1}
              px={2}
              layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
            >
              {fixture.team_a?.short_name}
            </Box>
          </Flex>
          {/* TODO: refactor this and add test case */}
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
                {[...(fixture.team_h?.stats?.matches ?? [])]
                  .reverse()
                  .map((m, index) => (
                    <Box key={index} as="span">
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
                {[...(fixture.team_a?.stats?.matches ?? [])]
                  .reverse()
                  .map((m, index) => (
                    <Box key={index} as="span">
                      {m.result.toUpperCase()}
                    </Box>
                  ))}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Goals</StatLabel>
              <StatNumber>{fixture.team_h?.stats?.g}</StatNumber>
              <StatHelpText>
                xG: {fixture.team_h?.stats?.xg.toFixed(2)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Goals</StatLabel>
              <StatNumber>{fixture.team_a?.stats?.g}</StatNumber>
              <StatHelpText>
                xG: {fixture.team_a?.stats?.xg.toFixed(2)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Conceded</StatLabel>
              <StatNumber>{fixture.team_h?.stats?.ga}</StatNumber>
              <StatHelpText>
                xGA: {fixture.team_h?.stats?.xga.toFixed(2)}
              </StatHelpText>
            </Stat>
            <Stat textAlign="center">
              <StatLabel>Conceded</StatLabel>
              <StatNumber>{fixture.team_a?.stats?.ga}</StatNumber>
              <StatHelpText>
                xGA: {fixture.team_a?.stats?.xga.toFixed(2)}
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
