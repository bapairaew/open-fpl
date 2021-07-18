import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useMemo } from "react";
import { Radar } from "react-chartjs-2";
import AutoSizer from "react-virtualized-auto-sizer";
import { assumedMax, getSummarytData } from "~/features/PlayerData/playerData";
import { Player } from "@open-fpl/data/features/AppData/playerDataTypes";
import theme from "~/theme";

const colors = [
  theme.colors.brand,
  theme.colors.red,
  theme.colors.green,
  theme.colors.orange,
  theme.colors.teal,
  theme.colors.yellow,
  theme.colors.blue,
  theme.colors.cyan,
  theme.colors.purple,
  theme.colors.gray,
  theme.colors.pink,
];

const maxMap = [
  assumedMax.recentG,
  assumedMax.recentA,
  assumedMax.recentShots,
  assumedMax.recentKeyPasses,
  assumedMax.recentXG,
  assumedMax.recentXA,
  assumedMax.recentXGA,
  assumedMax.recentBPS,
  assumedMax.seasonG,
  assumedMax.seasonA,
  assumedMax.seasonShots,
  assumedMax.seasonKeyPasses,
  assumedMax.seasonXG,
  assumedMax.seasonXA,
  assumedMax.seasonXGA,
  assumedMax.seasonBPS,
];

const labels = [
  "Recent Goals",
  "Recent Assists",
  "Recent Shots",
  "Recent Key Passes",
  "Recent xG",
  "Recent xA",
  "Recent xGA",
  "Recent BPS",
  "Season Goals",
  "Season Assists",
  "Season Shots",
  "Season Key Passes",
  "Season xG",
  "Season xA",
  "Season xGA",
  "Season BPS",
];

const getActualData = (percentData: number, labelIndex: number) => {
  const isMax = percentData >= 100;
  return (
    ((maxMap[labelIndex] * percentData) / 100).toFixed(1) + (isMax ? "+" : "")
  );
};

const ComparePlayersModal = ({
  isOpen,
  onClose,
  players,
}: {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
}) => {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: players.map((player, index) => {
        const {
          recentG,
          recentA,
          recentShots,
          recentKeyPasses,
          recentXG,
          recentXA,
          recentXGA,
          recentBPS,
          seasonG,
          seasonA,
          seasonShots,
          seasonKeyPasses,
          seasonXG,
          seasonXA,
          seasonXGA,
          seasonBPS,
        } = getSummarytData(player);
        return {
          label: player.web_name,
          data: [
            recentG,
            recentA,
            recentShots,
            recentKeyPasses,
            recentXG,
            recentXA,
            recentXGA,
            recentBPS,
            seasonG,
            seasonA,
            seasonShots,
            seasonKeyPasses,
            seasonXG,
            seasonXA,
            seasonXGA,
            seasonBPS,
          ],
          backgroundColor: transparentize(
            colors[index % colors.length][100],
            0.2
          ),
          borderColor: colors[index % colors.length][500],
          borderWidth: 1,
        };
      }),
    }),
    [players]
  );

  const chartOptions = useMemo(
    () => ({
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: ({ label, raw }: { label: string; raw: number }) =>
              getActualData(
                raw,
                chartData.labels.findIndex((l) => l === label)
              ),
          },
        },
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    }),
    [chartData]
  );

  return isOpen ? (
    <Drawer size="xl" placement="right" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontWeight="black">Players comparison</DrawerHeader>
        <DrawerBody p={0}>
          <Flex mb="50px" height="300px">
            <AutoSizer>
              {({ height, width }) => {
                return (
                  <Box height={`${height}px`} width={`${width}px`}>
                    <Radar
                      type="radar"
                      height={height}
                      width={width}
                      data={chartData}
                      options={chartOptions}
                    />
                  </Box>
                );
              }}
            </AutoSizer>
          </Flex>
          <Flex overflow="auto" mb={8}>
            <Table colorScheme="gray" fontSize="sm" size="sm" display="block">
              <Thead>
                <Tr>
                  <Th position="sticky" left={0} bg="white" />
                  {players.map((p) => (
                    <Th key={p.id} textAlign="right">
                      <Text width="80px" noOfLines={1}>
                        {p.web_name}
                      </Text>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {labels.map((label, rowIndex) => (
                  <Tr key={label}>
                    <Td textAlign="right" position="sticky" left={0} bg="white">
                      <Text width="140px">{label}</Text>
                    </Td>
                    {players.map((player, columnIndex) => (
                      <Td
                        key={player.id}
                        textAlign="right"
                        bg={`rgba(0, 255, 0, ${Math.min(
                          100,
                          chartData.datasets[columnIndex].data[rowIndex]
                        )}%)`}
                      >
                        {getActualData(
                          chartData.datasets[columnIndex].data[rowIndex],
                          rowIndex
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ) : null;
};

export default ComparePlayersModal;
