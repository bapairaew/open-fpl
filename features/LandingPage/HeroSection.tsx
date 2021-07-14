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

const HeroSection = (props: BoxProps) => (
  <Box {...props}>
    <Container maxW="container.xl">
      <Flex
        py={8}
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
        >
          Free <br />
          Open-source <br />
          FPL tools
        </Heading>
        <Text as="p" fontSize="lg" textAlign="center" color="gray.600" my={10}>
          No charge, No ads, No sign-up, No string attached.
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
