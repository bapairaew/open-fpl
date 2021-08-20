import {
  Box,
  BoxProps,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Link as A,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";

const features = [
  {
    title: "Live Dashboard",
    description:
      "Follow FPL matches, player performance, Gameweek points, and transfers in real-time (almost).",
    href: "https://app.openfpl.com/",
  },
  {
    title: "Players Statistics Explorer",
    description:
      "Explore Fantasy Premier League players statistics xG, xGA, (from Understat) and more to make a better decision on your team.",
    href: "https://app.openfpl.com/players",
  },
  {
    title: "Team Planner",
    description:
      "Plan your team lineup, transfers, captain and chip usage ahead of upcoming Fantasy Premier League gameweeks.",
    href: "https://app.openfpl.com/teams",
  },
  {
    title: "Fixture Difficulty Rating",
    description:
      "Fantasy Premier League fixtures and their Attack and Defence Fixture Difficulty Rating.",
    href: "https://app.openfpl.com/fixtures",
  },
];

const FeaturesSection = (props: BoxProps) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      py={16}
      bgColor={colorMode === "dark" ? "gray.900" : "gray.50"}
      {...props}
    >
      <Center mb={8} height="160px">
        <Divider
          orientation="vertical"
          borderColor={colorMode === "dark" ? "brand.200" : "brand.500"}
        />
      </Center>
      <Container maxW="container.xl">
        <Heading as="h2" fontWeight="black" textAlign="center">
          Features
        </Heading>
        <Text my={4} layerStyle="subtitle" textAlign="center">
          Collection of tools that will help level up your FPL game
        </Text>
        <Grid
          my={12}
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={4}
        >
          {features.map((feature) => (
            <Flex
              key={feature.title}
              p={6}
              layerStyle="sticky"
              boxShadow="lg"
              borderRadius="md"
              flexDirection="column"
            >
              <Heading as="h3" size="md" fontWeight="black">
                {feature.title}
              </Heading>
              <Text as="p" my={4} flexGrow={1}>
                {feature.description}
              </Text>
              <Link href={feature.href} passHref>
                <A>
                  Start using <Icon as={IoArrowForwardOutline} />
                </A>
              </Link>
            </Flex>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
