import {
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
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";

const DeadlineCountdownModal = ({
  isOpen,
  onClose,
  players,
}: {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
}) => {
  const sortedPlayers = players.sort((a, b) => {
    const aAbsTransfers = Math.abs(
      (a.transfers_in_event ?? 0) - (a.transfers_out_event ?? 0)
    );
    const bAbsTransfers = Math.abs(
      (b.transfers_in_event ?? 0) - (b.transfers_out_event ?? 0)
    );
    if (aAbsTransfers > bAbsTransfers) return -1;
    if (aAbsTransfers < bAbsTransfers) return 1;
    return a.selected_by_percent.localeCompare(b.selected_by_percent);
  });

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
                <Th position="sticky" top={0} left={0} zIndex={1}>
                  Name
                </Th>
                <Th position="sticky" top={0}>
                  Team
                </Th>
                <Th position="sticky" top={0}>
                  Pos
                </Th>
                <Th position="sticky" top={0}>
                  Own
                </Th>
                <Th position="sticky" top={0}>
                  Cost
                </Th>
                <Th position="sticky" top={0}></Th>
                <Th position="sticky" top={0}>
                  Transfer
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedPlayers.map((player) => (
                <Tr key={player.id}>
                  <Th position="sticky" left={0}>
                    {player.web_name}
                  </Th>
                  <Td>{player.team.short_name}</Td>
                  <Td>{player.element_type.singular_name_short}</Td>
                  <Td textAlign="right">{player.selected_by_percent}</Td>
                  <Td textAlign="right">{(player.now_cost / 10).toFixed(1)}</Td>
                  <Td textAlign="right">
                    ({((player.cost_change_event ?? 0) / 10).toFixed(1)})
                  </Td>
                  <Td textAlign="right">
                    {(
                      (player.transfers_in_event ?? 0) -
                      (player.transfers_out_event ?? 0)
                    ).toLocaleString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DeadlineCountdownModal;
