import { Box, BoxProps, Code, Flex, Icon, Link as A } from "@chakra-ui/react";
import FullScreenMessage, {
  FullScreenMessageProps,
} from "@open-fpl/common/features/Layout/FullScreenMessage";
import externalLinks from "@open-fpl/common/features/Navigation/externalLinks";
import { IoOpenOutline } from "react-icons/io5";

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
            <A href={externalLinks.github} isExternal>
              Github <Icon as={IoOpenOutline} />
            </A>{" "}
            or{" "}
            <A href={externalLinks.twitter} isExternal>
              Twitter
              <Icon as={IoOpenOutline} />
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
