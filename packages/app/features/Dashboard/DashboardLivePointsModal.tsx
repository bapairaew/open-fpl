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
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import StickyHeaderTable from "@open-fpl/app/features/Common/Table/StickyHeaderTable";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import { CSSProperties, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";

const CellWrapper = (props: BoxProps) => (
  <Flex px={2} alignItems="center" height="30px" {...props} />
);

const DashboardLivePointsModal = ({
  isOpen,
  onClose,
  allCurrentGameweekPlayers,
}: {
  isOpen: boolean;
  onClose: () => void;
  allCurrentGameweekPlayers: GameweekPlayerStat[];
}) => {
  const row = useMemo(
    () =>
      ({ index, style }: { index: number; style: CSSProperties }) => {
        const playerStat = allCurrentGameweekPlayers[index];
        const { width, ...restStyle } = style; // provided width: 100%; broke horizontal scroll with sticky items
        return (
          <Tr key={playerStat.player.id} style={restStyle}>
            <Th position="sticky" left={0} p={0}>
              <CellWrapper width="120px" textTransform="none">
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
                {playerStat.player.web_name}
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
                {playerStat.stats?.total_points}
              </CellWrapper>
            </Td>
            <Td p={0}>
              <CellWrapper width="80px" justifyContent="flex-end">
                {playerStat.stats?.bps}
              </CellWrapper>
            </Td>
            <Td p={0}>
              <CellWrapper width="80px" justifyContent="flex-end">
                {playerStat.stats?.goals_scored}
              </CellWrapper>
            </Td>
            <Td p={0}>
              <CellWrapper width="80px" justifyContent="flex-end">
                {playerStat.stats?.assists}
              </CellWrapper>
            </Td>
            <Td p={0}>
              <CellWrapper width="80px" justifyContent="flex-end">
                {playerStat.stats?.minutes}
              </CellWrapper>
            </Td>
          </Tr>
        );
      },
    [allCurrentGameweekPlayers]
  );
  return (
    <Drawer size="lg" isOpen={isOpen} onClose={onClose}>
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
                  itemCount={allCurrentGameweekPlayers.length}
                  headerRow={
                    <Tr>
                      <Th p={0} position="sticky" top={0} left={0} zIndex={1}>
                        <CellWrapper width="120px" justifyContent="center">
                          Name
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0}>
                        <CellWrapper width="80px" justifyContent="center">
                          Team
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0}>
                        <CellWrapper width="80px" justifyContent="center">
                          Pos.
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0}>
                        <CellWrapper width="80px" justifyContent="center">
                          Pts.
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0}>
                        <CellWrapper width="80px" justifyContent="center">
                          BPS
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0}>
                        <CellWrapper width="80px" justifyContent="center">
                          Goals
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0}>
                        <CellWrapper width="80px" justifyContent="center">
                          Assists
                        </CellWrapper>
                      </Th>
                      <Th position="sticky" top={0} p={0}>
                        <CellWrapper width="80px" justifyContent="center">
                          Mins.
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

export default DashboardLivePointsModal;
