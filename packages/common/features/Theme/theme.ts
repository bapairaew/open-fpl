import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import makeLayerStyles from "@open-fpl/common/features/Theme/makeLayerStyles";
import {
  difficultyColorCodes,
  positionColorCodes,
  statusColorCodes,
  teamColorCodes,
} from "@open-fpl/common/features/Theme/fplColors";

const customTheme = extendTheme(
  withDefaultColorScheme({ colorScheme: "brand" }),
  {
    styles: {
      global: {
        "html, body, #__next": {
          height: "100%",
        },
      },
    },
    colors: {
      brand: {
        "50": "#F3EBFA",
        "100": "#DDC7F0",
        "200": "#C7A3E6",
        "300": "#B27FDC",
        "400": "#9C5BD2",
        "500": "#8637C8",
        "600": "#6B2CA0",
        "700": "#502178",
        "800": "#361650",
        "900": "#1B0B28",
      },
      github: {
        "50": "#eef2fa",
        "100": "#eef2fa",
        "200": "#eef2fa",
        "300": "#9da5ae",
        "400": "#818b96",
        "500": "#24292f",
        "600": "#21262b",
        "700": "#040e12",
        "800": "#040e12",
        "900": "#040e12",
      },
    },
    layerStyles: {
      selected: {
        "&": {
          color: "white",
          bgColor: "brand.600",
          // https://github.com/chakra-ui/chakra-ui/issues/2231
          ".chakra-ui-dark &": {
            color: "gray.800",
            bgColor: "brand.200",
          },
        },
      },
      highlight: {
        "&": {
          bgColor: "gray.100",
          ".chakra-ui-dark &": {
            bgColor: "whiteAlpha.100",
          },
        },
      },
      highlightClickable: {
        "&": {
          bgColor: "gray.100",
          _hover: {
            bgColor: "gray.50",
          },
          _active: {
            bgColor: "gray.50",
          },
          ".chakra-ui-dark &": {
            bgColor: "whiteAlpha.100",
            _hover: {
              bgColor: "whiteAlpha.50",
            },
            _active: {
              bgColor: "whiteAlpha.50",
            },
          },
        },
      },
      brand: {
        "&": {
          color: "brand.500",
          ".chakra-ui-dark &": {
            color: "brand.200",
          },
        },
      },
      brandSolid: {
        "&": {
          bgColor: "brand.500",
          color: "white",
          ".chakra-ui-dark &": {
            bgColor: "brand.200",
            color: "gray.800",
          },
        },
      },
      success: {
        "&": {
          color: "green.500",
          ".chakra-ui-dark &": {
            color: "brand.200",
          },
        },
      },
      successSolid: {
        "&": {
          bgColor: "green.500",
          color: "white",
          ".chakra-ui-dark &": {
            bgColor: "green.200",
            color: "gray.800",
          },
        },
      },
      warning: {
        "&": {
          color: "yellow.500",
          ".chakra-ui-dark &": {
            color: "brand.200",
          },
        },
      },
      warningSolid: {
        "&": {
          bgColor: "yellow.500",
          color: "white",
          ".chakra-ui-dark &": {
            bgColor: "yellow.200",
            color: "gray.800",
          },
        },
      },
      danger: {
        "&": {
          color: "red.500",
          ".chakra-ui-dark &": {
            color: "brand.200",
          },
        },
      },
      dangerSolid: {
        "&": {
          bgColor: "red.500",
          color: "white",
          ".chakra-ui-dark &": {
            bgColor: "red.200",
            color: "gray.800",
          },
        },
      },
      sticky: {
        "&": {
          bgColor: "white",
          ".chakra-ui-dark &": {
            bgColor: "gray.800",
          },
        },
      },
      stickyModal: {
        "&": {
          bgColor: "white",
          ".chakra-ui-dark &": {
            bgColor: "gray.700",
          },
        },
      },
      subtitle: {
        color: "gray.600",
        ".chakra-ui-dark &": {
          color: "whiteAlpha.600",
        },
      },
      ...makeLayerStyles(difficultyColorCodes, "fpl-difficulty"),
      ...makeLayerStyles(positionColorCodes, "fpl-position"),
      ...makeLayerStyles(statusColorCodes, "fpl-status"),
      ...makeLayerStyles(teamColorCodes, "fpl-team"),
    },
    components: {
      Link: {
        defaultProps: {
          variant: "brand",
        },
        variants: {
          plain: {},
          brand: ({ colorMode }) => ({
            color: colorMode === "dark" ? "brand.200" : "brand.600",
          }),
        },
      },
      Table: {
        baseStyle: ({ colorMode }) => ({
          th: {
            bgColor: colorMode === "dark" ? "gray.800" : "white",
          },
        }),
        defaultProps: {
          colorScheme: "gray",
          size: "sm",
        },
      },
    },
  }
);

export default customTheme;
