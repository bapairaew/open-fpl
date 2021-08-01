import { Box, BoxProps, Container } from "@chakra-ui/react";

const FooterSection = (props: BoxProps) => (
  <Box py={4} px={2} bg="gray.50" color="gray.600" {...props}>
    <Container maxW="container.xl">Made by Narudom 🇹🇭</Container>
  </Box>
);

export default FooterSection;
