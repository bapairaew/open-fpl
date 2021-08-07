import { Box, BoxProps, Container, useColorMode } from "@chakra-ui/react";

const FooterSection = (props: BoxProps) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      py={4}
      px={2}
      bgColor={colorMode === "dark" ? "gray.900" : "gray.50"}
      color={colorMode === "dark" ? "whiteAlpha.800" : "gray.600"}
      {...props}
    >
      <Container maxW="container.xl">Made by Narudom 🇹🇭</Container>
    </Box>
  );
};

export default FooterSection;
