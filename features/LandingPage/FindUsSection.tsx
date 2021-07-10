import {
  Box,
  BoxProps,
  Button,
  Container,
  Heading,
  Text,
  Link as A,
} from "@chakra-ui/react";
import Link from "next/link";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io5";
import externalLinks from "~/features/Navigation/externalLinks";

const FindUsSection = (props: BoxProps) => (
  <Box py={20} bg="brand.500" {...props}>
    <Container
      maxW="container.xl"
      color="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Heading as="h3" fontWeight="black">
        Find us
      </Heading>
      <Text my={4} color="brand.50" textAlign="center">
        Come find us for bugs report, features request, code contribution or any
        feedbacks
      </Text>
      <Box my={8}>
        <Link href={externalLinks.twitter} passHref>
          <Button
            as={A}
            isExternal
            mr={4}
            colorScheme="twitter"
            leftIcon={<IoLogoTwitter />}
          >
            Twitter
          </Button>
        </Link>
        <Link href={externalLinks.github} passHref>
          <Button
            as={A}
            isExternal
            colorScheme="github"
            leftIcon={<IoLogoGithub />}
          >
            Github
          </Button>
        </Link>
      </Box>
    </Container>
  </Box>
);

export default FindUsSection;
