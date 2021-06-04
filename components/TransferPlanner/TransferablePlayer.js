import { Box } from "@chakra-ui/react";

const teamPlayerVariants = {
  default: {
    cursor: "pointer",
    _hover: {
      boxShadow: "md",
    },
  },
  selected: {
    cursor: "pointer",
    tabIndex: 1,
    bg: "highlight",
    boxShadow: "lg",
  },
  swapable: {
    cursor: "pointer",
    tabIndex: 1,
  },
  disabled: {
    cursor: "default",
    opacity: 0.1,
    disabled: true,
  },
};

const TransferablePlayer = ({ ref, variant, onClick, children }) => {
  const variantProps = teamPlayerVariants[variant] ?? varaints.default;
  return (
    <Box
      as="button"
      ref={ref}
      p={1}
      flexBasis="200px"
      borderRadius="md"
      transition="all 300ms"
      onClick={onClick}
      {...variantProps}
    >
      {children}
    </Box>
  );
};

export default TransferablePlayer;
