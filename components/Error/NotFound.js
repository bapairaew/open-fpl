import { Button, Flex, Heading, Link, Text } from "@chakra-ui/react";

const NotFound = () => {
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
        「(°ヘ°)
      </Heading>
      <Heading my={4}>How did you get here?</Heading>
      <Text my={4}>This page no longer exists or has never been here.</Text>
      <Link href="/" passHref>
        <Button as="a" variant="link">
          Click here to get back home
        </Button>
      </Link>
    </Flex>
  );
};

export default NotFound;
