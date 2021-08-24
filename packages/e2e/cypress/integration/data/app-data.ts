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
          response.body.filter(
            (player) =>
              player.total_points > 0 && !player.linked_data.understat_id
          )
        ).to.have.length(0);
      });
    });

    it("has no players with a duplicated link.", () => {
      cy.request("/app-data/players.json").then((response) => {
        expect(
          response.body.filter(
            (player) =>
              player.linked_data.understat_id !== null &&
              response.body.some(
                (p) =>
                  p !== player &&
                  p.linked_data.understat_id === player.linked_data.understat_id
              )
          )
        ).to.have.length(0);
      });
    });
  });

  describe("Fixtures", () => {
    it("has 20 teams and each team has 38 fixtures.", () => {
      cy.request("/app-data/fixtures.json").then((response) => {
        expect(response.body).to.have.length(20);
        expect(response.body.every((t) => t.fixtures.length === 38)).to.be.true;
      });
    });
  });

  describe("Teams", () => {
    it("has 20 teams with stats.", () => {
      cy.request("/app-data/teams.json").then((response) => {
        expect(response.body.filter((t) => t.stats)).to.have.length(20);
      });
    });

    it("has 1 - 20 positions and 1 - 20 xPositions.", () => {
      cy.request("/app-data/teams.json").then((response) => {
        expect([
          // @ts-ignore
          ...new Set(response.body.map((t) => t.stats?.position)),
        ]).to.have.length(20);
      });
      cy.request("/app-data/teams.json").then((response) => {
        expect([
          // @ts-ignore
          ...new Set(response.body.map((t) => t.stats?.xposition)),
        ]).to.have.length(20);
      });
    });

    it("matches have its mirror.", () => {
      cy.request("/app-data/teams.json").then((response) => {
        expect(
          response.body.filter((t1) =>
            t1.stats?.matches.every((m1) =>
              response.body.some((t2) =>
                t2.stats?.matches.some(
                  (m2) => m2 !== m1 && m2.id === m1.id && m2.opponent === t1.id
                )
              )
            )
          )
        ).to.have.length(20);
      });
    });
  });
});
