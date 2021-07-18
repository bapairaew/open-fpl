module.exports = {
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
    ];
  },
};
