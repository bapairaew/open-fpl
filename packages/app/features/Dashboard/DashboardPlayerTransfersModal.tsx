import {
  Box,
  BoxProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  StatArrow,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import numberFormatter from "@open-fpl/app/features/Common/numberFormatter";
import StickyHeaderTable from "@open-fpl/app/features/Common/Table/StickyHeaderTable";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { CSSProperties, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";

const CellWrapper = (props: BoxProps) => (
  <Flex px={2} alignItems="center" height="30px" {...props} />
);

const DashboardPlayerTransfersModal = ({
  isOpen,
  onClose,
  players,
}: {
  isOpen: boolean;
  onClose: () => void;
  players: GameweekPlayerStat[];
}) => {
  const row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => {
        const playerStat = players[index];
        const { width, ...restStyle } = style; // provided width: 100%; broke horizontal scroll with sticky items

        const transfersDelta =
          (playerStat?.player.transfers_in_event ?? 0) -
          (playerStat?.player.transfers_out_event ?? 0);
        const costDelta = playerStat.player.cost_change_event ?? 0 / 10;

        return (
          <Tr key={playerStat.player.id} style={restStyle}>
            <Th position="sticky" left={0} p={0}>
              <CellWrapper width="140px" textTransform="none">
                <Flex as="span" flexDirection="column" mr={2}>
                  {playerStat.live && (
                    <Box
                      as="span"
                      width="6px"
                      height="6px"
                      borderRadius="50%"
                      my={0.5}
                      layerStyle="redSolid"
                    />
                  )}
                  {playerStat.picked && (
                    <Box
                      as="span"
                      width="6px"
                      height="6px"
                      borderRadius="50%"
                      my={0.5}
                      layerStyle="brandSolid"
                    />
                  )}
                </Flex>
                <Text as="span" noOfLines={1}>
                  {playerStat.player.web_name}
                </Text>
              </CellWrapper>
            </Th>
            <Td p={0}>
              <CellWrapper
                width="80px"
                justifyContent="center"
                layerStyle={`fpl-team-${playerStat.player.team.short_name}`}
              >
                {playerStat.player.team.short_name}
              </CellWrapper>
            </Td>
            <Td p={0}>
              <CellWrapper
                width="80px"
                justifyContent="center"
                layerStyle={`fpl-position-${playerStat.player.element_type.singular_name_short}`}
              >
                {playerStat.player.element_type.singular_name_short}
              </CellWrapper>
            </Td>
            <Td p={0}>
              <CellWrapper width="80px" justifyContent="flex-end">
                {playerStat.player.selected_by_percent}%
              </CellWrapper>
            </Td>
            <Td p={0}>
              <CellWrapper width="80px" justifyContent="flex-end">
                {transfersDelta !== 0 && (
                  <StatArrow
                    mr={1}
                    type={transfersDelta > 0 ? "increase" : "decrease"}
                  />
                )}
                {numberFormatter(Math.abs(transfersDelta), 0)}
              </CellWrapper>
            </Td>
            <Td p={0}>
              <CellWrapper width="80px" justifyContent="flex-end">
                {costDelta !== 0 && (
                  <StatArrow
                    mr={1}
                    type={transfersDelta > 0 ? "increase" : "decrease"}
                  />
                )}
                £{Math.abs(costDelta).toFixed(1)}
              </CellWrapper>
            </Td>
          </Tr>
        );
      },
    [players]
  );

  return (
    <Drawer size="md" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader />
        <DrawerCloseButton />
        <DrawerBody pt={4} px={0}>
          <AutoSizer>
            {({ height, width }) => (
              <Box
                display="block"
                overflow="auto"
                height={`${height}px`}
                width={`${width}px`}
                flexGrow={1}
              >
                <StickyHeaderTable
                  height={height}
                  width={width}
                  itemSize={33}
                  itemCount={players.length}
                  headerRow={
                    <Tr>
                      <Th p={0} position="sticky" top={0} left={0} zIndex={2}>
                        <CellWrapper width="140px" justifyContent="center">
                          Name
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0} zIndex={1}>
                        <CellWrapper width="80px" justifyContent="center">
                          Team
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0} zIndex={1}>
                        <CellWrapper width="80px" justifyContent="center">
                          Pos.
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0} zIndex={1}>
                        <CellWrapper width="80px" justifyContent="center">
                          Own.
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0} zIndex={1}>
                        <CellWrapper width="80px" justifyContent="center">
                          Δ xfers
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0} zIndex={1}>
                        <CellWrapper width="80px" justifyContent="center">
                          Δ Cost
                        </CellWrapper>
                      </Th>
                    </Tr>
                  }
                >
                  {row}
                </StickyHeaderTable>
              </Box>
            )}
          </AutoSizer>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DashboardPlayerTransfersModal;
