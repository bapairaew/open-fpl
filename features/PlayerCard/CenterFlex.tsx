import { BoxProps, Flex } from "@chakra-ui/react";

export type CenterFlexVariant = "mini" | "default";

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

const CenterFlex = ({
  variant = "default",
  ...props
}: BoxProps & { variant: CenterFlexVariant }) => {
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
