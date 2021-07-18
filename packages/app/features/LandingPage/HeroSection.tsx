import {
  Box,
  BoxProps,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { IoArrowForwardOutline } from "react-icons/io5";
import { RoughNotation } from "react-rough-notation";
import theme from "@open-fpl/app/theme";

const HeroSection = (props: BoxProps) => (
  <Box {...props}>
    <Container maxW="container.xl">
      <Flex
        pt={12}
        px={4}
        w="full"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading
          as="h1"
          size="4xl"
          lineHeight={1.3}
          fontWeight="black"
          textAlign="left"
          color="white"
          textShadow={`
          -1px -1px 0 ${theme.colors.brand[500]},  
           1px -1px 0 ${theme.colors.brand[500]},
           -1px 1px 0 ${theme.colors.brand[500]},
            1px 1px 0 ${theme.colors.brand[500]}`}
        >
          <RoughNotation show type="highlight" color={theme.colors.brand[500]}>
            <Box as="span" px={{ base: 2, md: 14 }}>
              Free <br />
            </Box>
          </RoughNotation>
          <RoughNotation show type="highlight" color={theme.colors.brand[500]}>
            <Box as="span" px={{ base: 2, md: 14 }}>
              Open-source <br />
            </Box>
          </RoughNotation>
          <RoughNotation show type="highlight" color={theme.colors.brand[500]}>
            <Box as="span" px={{ base: 2, md: 14 }}>
              FPL tools
            </Box>
          </RoughNotation>
        </Heading>
        <Text as="p" fontSize="lg" textAlign="center" color="gray.600" my={10}>
          No charge, No ads, No sign-up, No strings attached.
        </Text>
        <Link href="/players" passHref>
          <Button
            my={8}
            as="a"
            size="lg"
            rightIcon={<Icon as={IoArrowForwardOutline} />}
          >
            Start using
          </Button>
        </Link>
      </Flex>
    </Container>
  </Box>
);

export default HeroSection;
