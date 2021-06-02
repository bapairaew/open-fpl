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
    bg: "highlight",
    boxShadow: "lg",
  },
  swapable: {
    cursor: "pointer",
  },
  disabled: {
    opacity: 0.1,
  },
};

const TransferablePlayer = ({ variant, onClick, children }) => {
  const variantProps = teamPlayerVariants[variant] ?? varaints.default;
  return (
    <Box
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
