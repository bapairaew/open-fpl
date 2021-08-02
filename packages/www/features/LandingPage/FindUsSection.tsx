import {
  Box,
  BoxProps,
  Button,
  Container,
  Heading,
  Text,
  Link as A,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io5";
import externalLinks from "@open-fpl/common/features/Navigation/externalLinks";

const FindUsSection = (props: BoxProps) => {
  const { colorMode } = useColorMode();
  return (
    <Box py={20} bgColor="brand.500" {...props}>
      <Container
        maxW="container.xl"
        color={colorMode === "dark" ? "gray.800" : "white"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading as="h3" fontWeight="black">
          Find us
        </Heading>
        <Text
          my={4}
          color={colorMode === "dark" ? "gray.700" : "gray.50"}
          textAlign="center"
        >
          Come find us for bugs report, features request, code contribution or
          any feedbacks
        </Text>
        <Box my={8}>
          <Button
            mr={4}
            as={A}
            isExternal
            colorScheme="twitter"
            href={externalLinks.twitter}
            _hover={{ textDecoration: "none" }}
            leftIcon={<IoLogoTwitter />}
          >
            Twitter
          </Button>
          <Button
            as={A}
            isExternal
            colorScheme="github"
            href={externalLinks.github}
            _hover={{ textDecoration: "none" }}
            leftIcon={<IoLogoGithub />}
          >
            Github
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FindUsSection;
