const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy()({
  images: {
    domains: ["fantasy.premierleague.com"],
  },
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      {
        source: "/help",
        destination: "/help/dashboard",
        permanent: true,
      },
    ];
  },
});
