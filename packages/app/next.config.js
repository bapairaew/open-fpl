const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy()({
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      {
        source: "/help",
        destination: "/help/players",
        permanent: true,
      },
      {
        source: "/players",
        destination: "/",
        permanent: false,
      },
    ];
  },
});
