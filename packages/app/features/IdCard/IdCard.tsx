import { Box, Flex, useColorMode } from "@chakra-ui/react";
import theme from "@open-fpl/common/features/Theme/theme";
// @ts-ignore
import Card from "react-animated-3d-card";
import { Line } from "react-chartjs-2";

interface IdCardProps {
  name: string;
  current: number[];
  past: number[];
}

const IdCard = ({ name, current, past }: IdCardProps) => {
  const { colorMode } = useColorMode();
  const isRankUp =
    current[current.length - 1] > current[current.length - 2] ? false : true;

  const labels = current.map((c) => `GW${c + 1}`);
  const data = {
    labels,
    datasets: [
      {
        data: current,
        borderColor: isRankUp ? theme.colors.green[500] : theme.colors.red[500],
        backgroundColor: isRankUp
          ? theme.colors.green[500]
          : theme.colors.red[500],
        tension: 0.5,
        pointRadius: 0,
        fill: "start",
      },
    ],
  };
  const options = {
    animation: false,
    maintainAspectRatio: false,
    bezierCurve: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        beginAtZero: true,
        reverse: true,
        start: 0,
      },
    },
  };

  return (
    <>
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <Box>
          <Card
            shineStrength={0.1}
            borderRadius="5px"
            cursorPointer={false}
            style={{
              "background-color":
                colorMode === "dark"
                  ? theme.colors.gray[700]
                  : theme.colors.gray[50],
              width: "500px",
              height: "320px",
            }}
          >
            <Box mx={4} my={4}>
              <Box
                fontWeight="black"
                fontSize="3xl"
                color={colorMode === "dark" ? "white" : "gray.700"}
              >
                {name}
              </Box>
            </Box>
            <Box
              px={4}
              pt={4}
              pb={6}
              my={4}
              textAlign="center"
              position="relative"
              bg={colorMode === "dark" ? "gray.800" : "gray.100"}
            >
              <Box
                position="absolute"
                width="100%"
                height="100%"
                left={0}
                top={0}
                opacity={0.5}
                zIndex={-1}
              >
                <Line data={data} options={options} />
              </Box>
              <Box
                fontWeight="black"
                fontSize="6xl"
                color={colorMode === "dark" ? "white" : "gray.700"}
              >
                {current[current.length - 1].toLocaleString()}
              </Box>
              <Box
                mt={-2}
                opacity={0.5}
                fontSize="lg"
                color={colorMode === "dark" ? "white" : "gray.700"}
              >
                GW{current.length + 1} overall rank
              </Box>
            </Box>
            <Flex mx={4} my={4} justifyContent="space-around">
              <Box textAlign="center">
                <Box
                  fontWeight="black"
                  fontSize="xl"
                  color={colorMode === "dark" ? "white" : "gray.700"}
                >
                  {Math.min(...current).toLocaleString()}
                </Box>
                <Box
                  mt={-1}
                  opacity={0.5}
                  fontSize="sm"
                  color={colorMode === "dark" ? "white" : "gray.700"}
                >
                  Season peak
                </Box>
              </Box>
              <Box textAlign="center">
                <Box
                  fontWeight="black"
                  fontSize="xl"
                  color={colorMode === "dark" ? "white" : "gray.700"}
                >
                  {Math.min(...past).toLocaleString()}
                </Box>
                <Box
                  mt={-1}
                  opacity={0.5}
                  fontSize="sm"
                  color={colorMode === "dark" ? "white" : "gray.700"}
                >
                  All time peak
                </Box>
              </Box>
            </Flex>
          </Card>
          <Box textAlign="right" mt={6} opacity={0.5}>
            openfpl.com
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default IdCard;
