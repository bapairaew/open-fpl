import {
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from "@chakra-ui/react";

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
      brand: baseTheme.colors.blue,
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default customTheme;
