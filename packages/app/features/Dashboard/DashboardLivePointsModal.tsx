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
  Box,
  Flex,
} from "@chakra-ui/react";
import { GameweekPlayerStat } from "@open-fpl/app/features/Dashboard/dashboardTypes";
import StickyHeaderTable from "@open-fpl/app/features/Common/Table/StickyHeaderTable";
import AutoSizer from "react-virtualized-auto-sizer";
import { ChangeEvent, CSSProperties, MouseEvent, useMemo } from "react";

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
        // const { ...restStyle } = style; // provided width: 100%; broke horizontal scroll with sticky items
        return (
          <Tr key={playerStat.player.id} style={style}>
            <Th position="sticky" left={0}>
              <Box width="120px" textTransform="none">
                {playerStat.player.web_name}
              </Box>
            </Th>
            <Td p={0}>
              <Flex
                width="80px"
                justifyContent="center"
                alignItems="center"
                height="30px"
                layerStyle={`fpl-team-${playerStat.player.team.short_name}`}
              >
                {playerStat.player.team.short_name}
              </Flex>
            </Td>
            <Td p={0}>
              <Flex
                width="80px"
                justifyContent="center"
                alignItems="center"
                height="30px"
                layerStyle={`fpl-position-${playerStat.player.element_type.singular_name_short}`}
              >
                {playerStat.player.element_type.singular_name_short}
              </Flex>
            </Td>
            <Td p={0}>
              <Box width="80px" px={2} textAlign="right">
                {playerStat.stats?.total_points}
              </Box>
            </Td>
            <Td p={0}>
              <Box width="80px" px={2} textAlign="right">
                {playerStat.stats?.bps}
              </Box>
            </Td>
            <Td p={0}>
              <Box width="80px" px={2} textAlign="right">
                {playerStat.stats?.goals_scored}
              </Box>
            </Td>
            <Td p={0}>
              <Box width="80px" px={2} textAlign="right">
                {playerStat.stats?.assists}
              </Box>
            </Td>
            <Td p={0}>
              <Box width="80px" px={2} textAlign="right">
                {playerStat.stats?.minutes}
              </Box>
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
        <DrawerBody>
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
                      <Th
                        position="sticky"
                        top={0}
                        left={0}
                        zIndex={1}
                        textAlign="center"
                      >
                        <Box width="120px">Name</Box>
                      </Th>
                      <Th position="sticky" top={0} p={0} textAlign="center">
                        <Box width="80px">Team</Box>
                      </Th>
                      <Th position="sticky" top={0} p={0} textAlign="center">
                        <Box width="80px">Pos.</Box>
                      </Th>
                      <Th position="sticky" top={0} p={0} textAlign="center">
                        <Box width="80px">Pts.</Box>
                      </Th>
                      <Th position="sticky" top={0} p={0} textAlign="center">
                        <Box width="80px">BPS</Box>
                      </Th>
                      <Th position="sticky" top={0} p={0} textAlign="center">
                        <Box width="80px">Goals</Box>
                      </Th>
                      <Th position="sticky" top={0} p={0} textAlign="center">
                        <Box width="80px">Assists</Box>
                      </Th>
                      <Th position="sticky" top={0} p={0} textAlign="center">
                        <Box width="80px">Mins.</Box>
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
