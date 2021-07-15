module.exports = {
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
