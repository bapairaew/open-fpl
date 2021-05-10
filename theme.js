const theme = {
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#33e",
    secondary: "#33e",
    muted: "#e8e8e8",
    highlight: "#33e",
    gray: "#777",
    accent: "#609",
    danger: "rgb(255, 23, 81)",
    warning: "rgb(255, 171, 27)",
    success: "rgb(1, 252, 122)",
  },
  fonts: {
    body:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "inherit",
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72],
  fontWeights: {
    body: 400,
    heading: 700,
    display: 900,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  textStyles: {
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
      maxWidth: 680,
      mx: "auto",
      px: 3,
    },
    display: {
      variant: "textStyles.heading",
      fontSize: [5, 6],
      fontWeight: "display",
      letterSpacing: "-0.03em",
      mt: 3,
      maxWidth: 680,
      mx: "auto",
      px: 3,
    },
    paragraph: {
      maxWidth: 680,
      mx: "auto",
      px: 3,
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    h1: {
      variant: "textStyles.display",
    },
    h2: {
      variant: "textStyles.heading",
      fontSize: 5,
    },
    h3: {
      variant: "textStyles.heading",
      fontSize: 4,
    },
    h4: {
      variant: "textStyles.heading",
      fontSize: 3,
    },
    h5: {
      variant: "textStyles.heading",
      fontSize: 2,
    },
    h6: {
      variant: "textStyles.heading",
      fontSize: 1,
    },
    a: {
      color: "text",
      "&:hover": {
        color: "secondary",
      },
      cursor: "pointer",
    },
    pre: {
      fontFamily: "monospace",
      fontSize: 1,
      p: 3,
      color: "text",
      bg: "muted",
      overflow: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: 1,
      maxWidth: 680,
      mx: "auto",
      px: 3,
      ".comment,.prolog,.doctype,.cdata,.punctuation,.operator,.entity,.url": {
        color: "gray",
      },
      ".comment": {
        fontStyle: "italic",
      },
      ".property, .tag, .boolean, .number, .constant, .symbol, .deleted, .function, .class-name, .regex, .important, .variable": {
        color: "accent",
      },
      ".atrule, .attr-value, .keyword": {
        color: "primary",
      },
      ".selector, .attr-name, .string, .char, .builtin, .inserted": {
        color: "secondary",
      },
    },
    inlineCode: {
      fontFamily: "monospace",
      color: "secondary",
      bg: "muted",
    },
    table: {
      width: "100%",
      my: 4,
      borderCollapse: "separate",
      borderSpacing: 0,
      "th,td": {
        textAlign: "left",
        py: "4px",
        pr: "4px",
        pl: 0,
        borderColor: "muted",
        borderBottomStyle: "solid",
      },
    },
    th: {
      verticalAlign: "bottom",
      borderBottomWidth: "2px",
    },
    td: {
      verticalAlign: "top",
      borderBottomWidth: "1px",
    },
    hr: {
      border: 0,
      borderBottom: "1px solid",
      borderColor: "muted",
    },
    ul: {
      variant: "textStyles.paragraph",
      pl: 5,
    },
    ol: {
      variant: "textStyles.paragraph",
      pl: 5,
    },
    p: {
      variant: "textStyles.paragraph",
    },
  },
  text: {
    display: {
      fontWeight: "display",
    },
    subtitle: {
      fontSize: 1,
      color: "gray",
    },
    cardTitle: {
      fontSize: 2,
      fontWeight: "title",
      display: "-webkit-box",
      WebkitLineClamp: "2",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  layout: {
    container: {
      p: 3,
    },
    text: {
      p: 3,
      maxWidth: 680,
      mx: "auto",
    },
  },
  sizes: {
    container: 1320,
  },
  radii: {
    none: "0",
    small: "0.125rem",
    default: "0.25rem",
    large: "0.5rem",
    full: "9999px",
  },
  zIndices: {
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
    auto: "auto",
  },
  links: {
    nav: {
      fontWeight: "body",
      cursor: "pointer",
    },
  },
  cards: {
    primary: {
      p: 3,
      borderRadius: "default",
      backgroundColor: "background",
      borderTopWidth: 1,
      borderLeft: 1,
      borderRight: 1,
      borderBottom: 4,
      borderStyle: "solid",
      borderColor: "text",
    },
    compact: {
      p: 2,
      borderRadius: "small",
      backgroundColor: "background",
      borderTopWidth: 1,
      borderLeft: 1,
      borderRight: 1,
      borderBottom: 4,
      borderStyle: "solid",
      borderColor: "text",
    },
    bare: {
      borderRadius: "small",
      backgroundColor: "background",
      borderTopWidth: 1,
      borderLeft: 1,
      borderRight: 1,
      borderBottom: 4,
      borderStyle: "solid",
      borderColor: "text",
    },
  },
  buttons: {
    primary: {
      cursor: "pointer",
    },
    secondary: {
      cursor: "pointer",
    },
  },
};

export default theme;
