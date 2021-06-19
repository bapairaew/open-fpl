import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const customTheme = extendTheme(
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
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default customTheme;
