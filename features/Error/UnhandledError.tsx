import { BoxProps, Link as A } from "@chakra-ui/react";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";
import externalLinks from "~/features/Navigation/externalLinks";

const UnhandledError = (props: BoxProps) => {
  return (
    <FullScreenMessage
      symbol="(´～`)"
      heading="Uh oh, something went wrong."
      text={
        <>
          To be honest, we are not too sure what happened so please tell us what
          you did on{" "}
          <A href={externalLinks.github} isExternal color="brand.500">
            Github
          </A>{" "}
          or{" "}
          <A href={externalLinks.twitter} isExternal color="brand.500">
            Twitter
          </A>
          .
        </>
      }
      linkHref="/"
      linkText="Click here to get back home"
      {...props}
    />
  );
};

export default UnhandledError;
