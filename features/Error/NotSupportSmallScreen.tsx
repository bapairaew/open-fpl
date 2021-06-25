import { BoxProps, Text } from "@chakra-ui/react";
import FullScreenMessage from "~/features/Layout/FullScreenMessage";

const NotSupportSmallScreen = (props: BoxProps) => {
  return (
    <FullScreenMessage
      symbol="<(_ _)>"
      heading={
        <>
          Sorry,{" "}
          <Text as="strong" fontWeight="black">
            Open FPL
          </Text>{" "}
          does not support smaller screen yet.
        </>
      }
      text="Please come back on a desktop or tablet device."
      {...props}
    />
  );
};

export default NotSupportSmallScreen;
