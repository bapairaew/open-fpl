import marked from "marked";
import { ParsedRequest } from "~/features/OpenGraphImages/openGraphImagestypes";
import { sanitizeHtml } from "~/features/OpenGraphImages/sanitizer";
import theme from "~/theme";

const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

function getCss(fontSize: string) {
  let background = "white";
  let foreground = "black";

  return `
body {
  background: ${background};
  background-image: linear-gradient(to bottom, ${theme.colors.white}, ${
    theme.colors.gray[50]
  }, ${theme.colors.gray[50]});
  height: 100vh;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.body};
}
code {
  font-family: ${theme.fonts.mono};
  white-space: pre-wrap;
  letter-spacing: -5px;
}
code:before, code:after {
  content: '\`';
}
.logo-wrapper {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
.logo {
  margin: 0 75px;
}
.plus {
  color: #BBB;
  font-size: 100px;
}
.spacer {
  margin: 150px;
}
.emoji {
  height: 1em;
  width: 1em;
  margin: 0 .05em 0 .1em;
  vertical-align: -0.1em;
}

.heading {
  font-family: ${theme.fonts.heading};
  font-size: ${sanitizeHtml(fontSize)};
  color: ${foreground};
  line-height: ${theme.lineHeights.normal};
  font-weight: ${theme.fontWeights.black};
}`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, md, fontSize, images, widths, heights } = parsedReq;
  return `<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(fontSize)}
  </style>
  <body>
    <div>
      <div class="spacer">
      <div class="logo-wrapper">
        ${images
          .map(
            (img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i])
          )
          .join("")}
      </div>
      <div class="spacer">
      <div class="heading">${emojify(md ? marked(text) : sanitizeHtml(text))}
      </div>
    </div>
  </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
  class="logo"
  alt="Generated Image"
  src="${sanitizeHtml(src)}"
  width="${sanitizeHtml(width)}"
  height="${sanitizeHtml(height)}"
/>`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
