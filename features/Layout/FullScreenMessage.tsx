import { BoxProps, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";

const FullScreenMessage = ({
  symbol,
  heading,
  text,
  linkText,
  linkHref,
  ...props
}: {
  symbol: string | ReactNode;
  heading: string | ReactNode;
  text: string | ReactNode;
  linkText?: string;
  linkHref?: string;
} & BoxProps) => {
  return (
    <Flex
      h="100%"
      w="100%"
      px={6}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      {...props}
    >
      <Heading size="2xl" my={4}>
        {symbol}
      </Heading>
      <Heading my={4} fontWeight="black">
        {heading}
      </Heading>
      <Text my={4}>{text}</Text>
      {linkText && linkHref && (
        <Link href={linkHref} passHref>
          <Button as="a" variant="link">
            {linkText}
          </Button>
        </Link>
      )}
    </Flex>
  );
};

export default FullScreenMessage;
