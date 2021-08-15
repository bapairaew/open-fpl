import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

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
  home,
  away,
  kickoffTime,
  players,
}: {
  isOpen: boolean;
  onClose: () => void;
  home: Team;
  away: Team;
  kickoffTime: string;
  players: Player[];
}) => {
  const homePlayers = players
    .filter((p) => p.team.id === home.id)
    .sort((a, b) =>
      a.total_points > b.total_points
        ? -1
        : a.total_points < b.total_points
        ? 1
        : 0
    )
    .slice(0, 5);
  const awayPlayers = players
    .filter((p) => p.team.id === away.id)
    .sort((a, b) =>
      a.total_points > b.total_points
        ? -1
        : a.total_points < b.total_points
        ? 1
        : 0
    )
    .slice(0, 5);

  return (
    <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader />
        <DrawerCloseButton />
        <DrawerBody pt={4}>
          <Table>
            <Thead>
              <Tr>
                <Th />
                <Th p={0} fontSize="lg" fontWeight="black" textAlign="center">
                  <Box p={2} layerStyle={`fpl-team-${home.short_name}`}>
                    {home.short_name}
                  </Box>
                </Th>
                <Th p={0} fontSize="lg" fontWeight="black" textAlign="center">
                  <Box p={2} layerStyle={`fpl-team-${away.short_name}`}>
                    {away.short_name}
                  </Box>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Th>Kickoff</Th>
                <Td colSpan={2} textAlign="center">
                  {kickoffTime}
                </Td>
              </Tr>
              <Tr>
                <Th>Position</Th>
                <Td textAlign="center">{nth(home.stats?.position ?? 0)}</Td>
                <Td textAlign="center">{nth(away.stats?.position ?? 0)}</Td>
              </Tr>
              <Tr>
                <Th>X Position</Th>
                <Td textAlign="center">{nth(home.stats?.xposition ?? 0)}</Td>
                <Td textAlign="center">{nth(away.stats?.xposition ?? 0)}</Td>
              </Tr>
              <Tr>
                <Th>W-D-L</Th>
                <Td textAlign="center">
                  {home.stats?.wins ?? 0}-{home.stats?.draws ?? 0}-
                  {home.stats?.loses ?? 0}
                </Td>
                <Td textAlign="center">
                  {away.stats?.wins ?? 0}-{away.stats?.draws ?? 0}-
                  {away.stats?.loses ?? 0}
                </Td>
              </Tr>
              <Tr>
                <Th>Form</Th>
                <Td textAlign="center">
                  {home?.stats?.matches
                    .map((m) => m.result.toUpperCase())
                    .join("")}
                </Td>
                <Td textAlign="center">
                  {away?.stats?.matches
                    .map((m) => m.result.toUpperCase())
                    .join("")}
                </Td>
              </Tr>
              <Tr>
                <Th>Attack</Th>
                <Td textAlign="center">{home.strength_attack_home}</Td>
                <Td textAlign="center">{away.strength_attack_away}</Td>
              </Tr>
              <Tr>
                <Th>Defence</Th>
                <Td textAlign="center">{home.strength_defence_home}</Td>
                <Td textAlign="center">{away.strength_defence_away}</Td>
              </Tr>
              <Tr>
                <Th>Goals</Th>
                <Td textAlign="center">{home.stats?.g}</Td>
                <Td textAlign="center">{away.stats?.g}</Td>
              </Tr>
              <Tr>
                <Th>xG</Th>
                <Td textAlign="center">{home.stats?.xg.toFixed(2)}</Td>
                <Td textAlign="center">{away.stats?.xg.toFixed(2)}</Td>
              </Tr>
              <Tr>
                <Th>GA</Th>
                <Td textAlign="center">{home.stats?.ga}</Td>
                <Td textAlign="center">{away.stats?.ga}</Td>
              </Tr>
              <Tr>
                <Th>xGA</Th>
                <Td textAlign="center">{home.stats?.xga.toFixed(2)}</Td>
                <Td textAlign="center">{away.stats?.xga.toFixed(2)}</Td>
              </Tr>
              <Tr>
                <Th>Players</Th>
                <Td textAlign="center">
                  {homePlayers.map((p) => `${p.web_name} (${p.total_points})`)}
                </Td>
                <Td textAlign="center">
                  {awayPlayers.map((p) => `${p.web_name} (${p.total_points})`)}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DashboardUpcomingFixtureModal;
