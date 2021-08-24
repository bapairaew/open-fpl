describe("App data", () => {
  describe("Players", () => {
    it("generates players with linked_data.", () => {
      cy.request("/app-data/players.json").then((response) => {
        expect(response.body).to.have.length.above(0);
        expect(
          response.body.filter((player) => player.linked_data.understat_id)
        ).to.have.length.above(0);
      });
    });

    it("has no unlinked players that already played some games.", () => {
      cy.request("/app-data/players.json").then((response) => {
        expect(
          response.body
            .filter(
              (player) =>
                player.total_points > 0 && !player.linked_data.understat_id
            )
            .map((p) => p.web_name)
            .join(", ")
        ).to.have.length(0);
      });
    });
  });

  describe("Fixtures", () => {
    it("has 20 teams and each team has 38 matches.");
  });

  describe("Teams", () => {
    it("has 20 teams.");

    it("has 1 - 20 positions.");

    it("has 1 - 20 xPositions.");

    it("matches have its mirror.");
  });
});
