import {
  AspectRatio,
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
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import fixturesImage from "~/public/fixtures-difficulty-rating.png";
import playersExplorerImage from "~/public/players-stats-explorer.png";
import transferImage from "~/public/transfer-planner.png";

const features = [
  {
    title: "Players Statistics Explorer",
    description:
      "Explore Fantasy Premier League players statistics xG, xGA, (from Understat) and more to make a better decision on your team.",
    href: "/players",
  },
  {
    title: "Transfer Planner",
    description:
      "Plan your transfer, starting lineup and your bench ahead of upcoming Fantasy Premier League gameweeks.",
    href: "/transfers",
  },
  {
    title: "Fixture Difficulty Rating",
    description:
      "Fantasy Premier League fixtures and their Attack and Defence Fixture Difficulty Rating.",
    href: "/fixtures",
  },
];

const FeaturesSection = (props: BoxProps) => (
  <Box pt={16} {...props}>
    <Center mb={8} height="120px">
      <Divider orientation="vertical" borderColor="brand.500" />
    </Center>
    <Container maxW="container.xl">
      <Heading as="h2" fontWeight="black" textAlign="center">
        Features
      </Heading>
      <Text my={4} color="gray.600" textAlign="center">
        Collection of tools that will help level up your FPL game
      </Text>
      <Grid
        my={12}
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={4}
      >
        {features.map((feature) => (
          <Flex
            key={feature.title}
            p={6}
            bg="white"
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
              <A color="brand.500">
                Start using <Icon as={IoArrowForwardOutline} />
              </A>
            </Link>
          </Flex>
        ))}
      </Grid>

      <Box
        mt="150px"
        height={{
          base: "150px",
          md: "300px",
          lg: "400px",
        }}
        position="relative"
        overflow="hidden"
      >
        <AspectRatio
          width="80%"
          ratio={16 / 9}
          borderRadius="lg"
          boxShadow="lg"
          overflow="hidden"
          position="absolute"
          top={10}
          left="40%"
          transform="translateX(-50%)"
        >
          <Image
            layout="fill"
            objectFit="cover"
            src={fixturesImage}
            alt="Fixtures Difficulty Rating"
          />
        </AspectRatio>
        <AspectRatio
          width="80%"
          ratio={16 / 9}
          borderRadius="lg"
          boxShadow="lg"
          overflow="hidden"
          position="absolute"
          top={10}
          left="60%"
          transform="translateX(-50%)"
        >
          <Image
            layout="fill"
            objectFit="cover"
            src={playersExplorerImage}
            alt="Player Statistics Explorer"
          />
        </AspectRatio>
        <AspectRatio
          width="80%"
          ratio={16 / 9}
          borderRadius="lg"
          boxShadow="lg"
          overflow="hidden"
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
        >
          <Image
            layout="fill"
            objectFit="cover"
            src={transferImage}
            alt="Transfer Planner"
          />
        </AspectRatio>
      </Box>
    </Container>
  </Box>
);

export default FeaturesSection;
