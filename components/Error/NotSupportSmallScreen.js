import { Flex, Heading, Text } from "@chakra-ui/react";

const NotSupportSmallScreen = (props) => {
  return (
    <Flex
      h="100%"
      w="100%"
      px={6}
      justifyContent="center"
      flexDirection="column"
      {...props}
    >
      <Heading size="4xl" my={4}>
        :'(
      </Heading>
      <Heading my={4}>
        Sorry,{" "}
        <Text as="strong" fontWeight="black">
          Open FPL
        </Text>{" "}
        does not support smaller screen yet
      </Heading>
      <Text my={4}>Please come back on a desktop or tablet device.</Text>
    </Flex>
  );
};

export default NotSupportSmallScreen;
