import { Box, BoxProps, Container, Heading } from "@chakra-ui/react";
import Link from "next/link";

const HeaderSection = (props: BoxProps) => (
  <Box {...props}>
    <Container maxW="container.xl">
      <Link href="/" passHref>
        <Heading
          as="a"
          display="block"
          px={6}
          py={6}
          fontWeight="black"
          size="lg"
        >
          Open FPL
        </Heading>
      </Link>
    </Container>
  </Box>
);

export default HeaderSection;
