const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy()({
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      {
        source: "/players",
        destination: "https://app.openfpl.com/players",
      },
      {
        source: "/teams/:slug*",
        destination: "https://app.openfpl.com/teams/:slug*",
      },
      {
        source: "/help/:slug*",
        destination: "https://app.openfpl.com/help/:slug*",
      },
    ];
  },
});
