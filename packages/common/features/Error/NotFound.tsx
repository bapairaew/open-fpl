import { BoxProps } from "@chakra-ui/react";
import FullScreenMessage, {
  FullScreenMessageProps,
} from "@open-fpl/common/features/Layout/FullScreenMessage";

const NotFound = ({
  Wrapper = FullScreenMessage,
  ...props
}: BoxProps & {
  Wrapper?: React.FC<FullScreenMessageProps>;
}) => {
  return (
    <Wrapper
      symbol="「(°ヘ°)"
      heading="How did you get here?"
      text="This page no longer exists or has never been here."
      linkHref="/"
      linkText="Click here to get back home"
      {...props}
    />
  );
};

export default NotFound;
