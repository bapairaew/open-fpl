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

const DashboardFinishedFixtureModal = ({
  isOpen,
  onClose,
  fixture,
}: {
  isOpen: boolean;
  onClose: () => void;
  fixture: DashboardFixture;
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
                <Th>Score</Th>
                <Td textAlign="center">{fixture.team_h_score}</Td>
                <Td textAlign="center">{fixture.team_a_score}</Td>
              </Tr>
              <Tr>
                <Th>xG</Th>
                <Td textAlign="center">
                  {fixture.team_h?.stats?.matches
                    .find((m) => m.opponent === fixture.team_a?.id)
                    ?.xg.toFixed(2)}
                </Td>
                <Td textAlign="center">
                  {fixture.team_a?.stats?.matches
                    .find((m) => m.opponent === fixture.team_h?.id)
                    ?.xg.toFixed(2)}
                </Td>
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

export default DashboardFinishedFixtureModal;
