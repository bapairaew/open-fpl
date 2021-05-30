import { Flex } from "@chakra-ui/react";

const CenterFlex = ({ mini, ...props }) => {
  const py = mini ? 0.5 : 1;
  const px = mini ? 1 : 2;
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      px={px}
      py={py}
      {...props}
    />
  );
};

export default CenterFlex;
