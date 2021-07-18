import { BoxProps } from "@chakra-ui/react";
import FullScreenMessage from "@open-fpl/app/features/Layout/FullScreenMessage";

const NotFound = (props: BoxProps) => {
  return (
    <FullScreenMessage
      symbol="「(°ヘ°)"
      heading="How do you get here?"
      text="This page no longer exists or has never been here."
      linkHref="/players"
      linkText="Click here to get back home"
      {...props}
    />
  );
};

export default NotFound;
