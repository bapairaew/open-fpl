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
}: {
  isOpen: boolean;
  onClose: () => void;
  fixture: DashboardFixture;
  kickoffTime: string;
}) => {
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
                  <Box
                    p={2}
                    layerStyle={`fpl-team-${fixture.team_h?.short_name}`}
                  >
                    {fixture.team_h?.short_name}
                  </Box>
                </Th>
                <Th p={0} fontSize="lg" fontWeight="black" textAlign="center">
                  <Box
                    p={2}
                    layerStyle={`fpl-team-${fixture.team_a?.short_name}`}
                  >
                    {fixture.team_a?.short_name}
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
                <Td textAlign="center">
                  {nth(fixture.team_h?.stats?.position ?? 0)}
                </Td>
                <Td textAlign="center">
                  {nth(fixture.team_a?.stats?.position ?? 0)}
                </Td>
              </Tr>
              <Tr>
                <Th>X Position</Th>
                <Td textAlign="center">
                  {nth(fixture.team_h?.stats?.xposition ?? 0)}
                </Td>
                <Td textAlign="center">
                  {nth(fixture.team_a?.stats?.xposition ?? 0)}
                </Td>
              </Tr>
              <Tr>
                <Th>W-D-L</Th>
                <Td textAlign="center">
                  {fixture.team_h?.stats?.wins ?? 0}-
                  {fixture.team_h?.stats?.draws ?? 0}-
                  {fixture.team_h?.stats?.loses ?? 0}
                </Td>
                <Td textAlign="center">
                  {fixture.team_a?.stats?.wins ?? 0}-
                  {fixture.team_a?.stats?.draws ?? 0}-
                  {fixture.team_a?.stats?.loses ?? 0}
                </Td>
              </Tr>
              <Tr>
                <Th>Form</Th>
                <Td textAlign="center">
                  {fixture.team_h?.stats?.matches
                    .map((m) => m.result.toUpperCase())
                    .join("")}
                </Td>
                <Td textAlign="center">
                  {fixture.team_h?.stats?.matches
                    .map((m) => m.result.toUpperCase())
                    .join("")}
                </Td>
              </Tr>
              <Tr>
                <Th>Attack</Th>
                <Td textAlign="center">
                  {fixture.team_h?.strength_attack_home}
                </Td>
                <Td textAlign="center">
                  {fixture.team_a?.strength_attack_away}
                </Td>
              </Tr>
              <Tr>
                <Th>Defence</Th>
                <Td textAlign="center">
                  {fixture.team_h?.strength_defence_home}
                </Td>
                <Td textAlign="center">
                  {fixture.team_a?.strength_defence_away}
                </Td>
              </Tr>
              <Tr>
                <Th>Goals</Th>
                <Td textAlign="center">{fixture.team_h?.stats?.g}</Td>
                <Td textAlign="center">{fixture.team_a?.stats?.g}</Td>
              </Tr>
              <Tr>
                <Th>xG</Th>
                <Td textAlign="center">
                  {fixture.team_h?.stats?.xg.toFixed(2)}
                </Td>
                <Td textAlign="center">
                  {fixture.team_a?.stats?.xg.toFixed(2)}
                </Td>
              </Tr>
              <Tr>
                <Th>GA</Th>
                <Td textAlign="center">{fixture.team_h?.stats?.ga}</Td>
                <Td textAlign="center">{fixture.team_a?.stats?.ga}</Td>
              </Tr>
              <Tr>
                <Th>xGA</Th>
                <Td textAlign="center">
                  {fixture.team_h?.stats?.xga.toFixed(2)}
                </Td>
                <Td textAlign="center">
                  {fixture.team_a?.stats?.xga.toFixed(2)}
                </Td>
              </Tr>
              <Tr>
                <Th>Players</Th>
                <Td textAlign="center">
                  {fixture.team_h_players?.map(
                    (p) =>
                      `${p.player.web_name} (${p.player.total_points ?? 0})`
                  )}
                </Td>
                <Td textAlign="center">
                  {fixture.team_a_players?.map(
                    (p) =>
                      `${p.player.web_name} (${p.player.total_points ?? 0})`
                  )}
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
