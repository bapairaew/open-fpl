import {
  Box,
  BoxProps,
  Button,
  Container,
  Heading,
  Link as A,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import externalLinks from "@open-fpl/common/features/Navigation/externalLinks";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io5";

const FindUsSection = (props: BoxProps) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      py={20}
      bgColor={colorMode === "dark" ? "brand.200" : "brand.500"}
      {...props}
    >
      <Container
        maxW="container.xl"
        color={colorMode === "dark" ? "gray.900" : "white"}
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
          color={colorMode === "dark" ? "gray.800" : "gray.50"}
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
            bgColor="twitter.500"
            color="white"
            href={externalLinks.twitter}
            _hover={{ textDecoration: "none", bgColor: "twitter.600" }}
            _active={{ bgColor: "twitter.600" }}
            leftIcon={<IoLogoTwitter />}
          >
            Twitter
          </Button>
          <Button
            as={A}
            isExternal
            bgColor="github.500"
            color="white"
            href={externalLinks.github}
            _hover={{ textDecoration: "none", bgColor: "github.600" }}
            _active={{ bgColor: "github.600" }}
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
