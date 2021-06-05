import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import externalLinks from "~/components/Navigation/externalLinks";

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
        <Link href={externalLinks.github} isExternal color="brand.500">
          Github
        </Link>{" "}
        or{" "}
        <Link href={externalLinks.twitter} isExternal color="brand.500">
          Twitter
        </Link>
        .
      </Text>
    </Flex>
  );
};

export default Error;
