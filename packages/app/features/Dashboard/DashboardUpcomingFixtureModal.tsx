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

const DashboardUpcomingFixtureDrawer = ({
  isOpen,
  onClose,
  home,
  away,
}: {
  isOpen: boolean;
  onClose: () => void;
  home: Team;
  away: Team;
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
                  TODO
                </Td>
              </Tr>
              <Tr>
                <Th>Position</Th>
                <Td textAlign="center">{home.position}</Td>
                <Td textAlign="center">{away.position}</Td>
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
                <Td textAlign="center">TODO</Td>
                <Td textAlign="center">TODO</Td>
              </Tr>
              <Tr>
                <Th>Defense</Th>
                <Td textAlign="center">TODO</Td>
                <Td textAlign="center">TODO</Td>
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
