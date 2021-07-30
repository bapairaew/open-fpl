import { BoxProps, Link as A, Box, Code, Flex } from "@chakra-ui/react";
import FullScreenMessage, {
  FullScreenMessageProps,
} from "@open-fpl/common/features/Layout/FullScreenMessage";
import externalLinks from "@open-fpl/common/features/Navigation/externalLinks";

const UnhandledError = ({
  Wrapper = FullScreenMessage,
  additionalInfo,
  ...props
}: BoxProps & {
  Wrapper?: React.FC<FullScreenMessageProps>;
  additionalInfo?: string;
}) => {
  return (
    <Wrapper
      symbol="(´～`)"
      heading="Uh oh, something went wrong."
      text={
        <>
          <Box>
            To be honest, we are not too sure what happened so please tell us
            what you did on{" "}
            <A href={externalLinks.github} isExternal color="brand.500">
              Github
            </A>{" "}
            or{" "}
            <A href={externalLinks.twitter} isExternal color="brand.500">
              Twitter
            </A>
            .
          </Box>
          {additionalInfo && (
            <Flex my={4} justifyContent="center">
              <Code>{additionalInfo}</Code>
            </Flex>
          )}
        </>
      }
      linkHref="/"
      linkText="Click here to get back home"
      {...props}
    />
  );
};

export default UnhandledError;
