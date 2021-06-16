import { Flex, Heading, Link as A, Text, Button } from "@chakra-ui/react";
import externalLinks from "~/features/Navigation/externalLinks";
import Link from "next/link";

const Error = () => {
  return (
    <Flex
      h="100%"
      w="100%"
      px={6}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Heading size="4xl" my={4}>
        (´～`)
      </Heading>
      <Heading my={4}>Uh oh, something went wrong.</Heading>
      <Text my={4}>
        To be honest, we are not too sure what happened so please tell us what
        you did on{" "}
        <A href={externalLinks.github} isExternal color="brand.500">
          Github
        </A>{" "}
        or{" "}
        <A href={externalLinks.twitter} isExternal color="brand.500">
          Twitter
        </A>
        .
      </Text>
      <Link href="/" passHref>
        <Button as="a" variant="link">
          Click here to get back home
        </Button>
      </Link>
    </Flex>
  );
};

export default Error;
