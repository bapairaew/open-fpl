import { SystemStyleObjectRecord } from "@chakra-ui/react";
import { ColorCodes } from "@open-fpl/common/features/Theme/fplColors";

const makeLayerStyles = (
  codes: (mode: string) => ColorCodes,
  prefix: string
) => {
  const lightMode = codes("light");
  const darkMode = codes("dark");
  const layerStyles: SystemStyleObjectRecord = {};
  Object.keys(lightMode).forEach((key) => {
    layerStyles[`${prefix}-${key}`] = lightMode[key];
    // @ts-ignore
    layerStyles[`${prefix}-${key}`][".chakra-ui-dark &"] = darkMode[key];
  });

  return layerStyles;
};

export default makeLayerStyles;
