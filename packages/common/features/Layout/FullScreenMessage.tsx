import { BoxProps, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";

export interface FullScreenMessageProps extends BoxProps {
  symbol: string | ReactNode;
  heading: string | ReactNode;
  text: string | ReactNode;
  linkText?: string;
  linkHref?: string;
}

const FullScreenMessage = ({
  symbol,
  heading,
  text,
  linkText,
  linkHref,
  ...props
}: FullScreenMessageProps) => {
  return (
    <>
      <Flex
        px={6}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        flexGrow={1}
        height="100%"
        {...props}
      >
        <Heading size="2xl" my={4}>
          {symbol}
        </Heading>
        <Heading my={4} fontWeight="black">
          {heading}
        </Heading>
        <Text as="p" my={4}>
          {text}
        </Text>
        {linkText && linkHref && (
          <Link href={linkHref} passHref>
            <Button as="a" variant="link">
              {linkText}
            </Button>
          </Link>
        )}
      </Flex>
    </>
  );
};

export default FullScreenMessage;
