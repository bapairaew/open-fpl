import { Flex } from "@chakra-ui/react";

const variants = {
  mini: {
    py: 0.5,
    px: 1,
  },
  default: {
    py: 1,
    px: 2,
  },
};
const CenterFlex = ({ variant = "default", ...props }) => {
  const variantProps = variants[variant] ?? variants.default;
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      {...variantProps}
      {...props}
    />
  );
};

export default CenterFlex;
