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
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";

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

const DashboardUpcomingFixtureDrawer = ({
  isOpen,
  onClose,
  home,
  away,
  kickoffTime,
}: {
  isOpen: boolean;
  onClose: () => void;
  home: Team;
  away: Team;
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
                <Th>Table</Th>
                <Td textAlign="center">
                  {nth(home.position)}
                  <br />
                  {home.win}-{home.draw}-{home.loss}
                </Td>
                <Td textAlign="center">
                  {nth(away.position)}
                  <br />
                  {away.win}-{away.draw}-{away.loss}
                </Td>
              </Tr>
              <Tr>
                <Th>Form</Th>
                <Td textAlign="center">
                  {home.form}
                  <br />
                  (DWLDWW)
                </Td>
                <Td textAlign="center">
                  {away.form}
                  <br />
                  (DWLDWW)
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
                <Td textAlign="center">TODO</Td>
                <Td textAlign="center">TODO</Td>
              </Tr>
              <Tr>
                <Th>xG</Th>
                <Td textAlign="center">TODO</Td>
                <Td textAlign="center">TODO</Td>
              </Tr>
              <Tr>
                <Th>G Against</Th>
                <Td textAlign="center">TODO</Td>
                <Td textAlign="center">TODO</Td>
              </Tr>
              <Tr>
                <Th>xGA</Th>
                <Td textAlign="center">TODO</Td>
                <Td textAlign="center">TODO</Td>
              </Tr>
              <Tr>
                <Th>Players</Th>
                <Td textAlign="center">TODO</Td>
                <Td textAlign="center">TODO</Td>
              </Tr>
            </Tbody>
          </Table>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DashboardUpcomingFixtureDrawer;
