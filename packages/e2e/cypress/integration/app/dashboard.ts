describe("Live Dashboard", () => {
  beforeEach(() => {
    cy.visit("/dashboard");
  });

  describe("Current Gameweek", () => {
    it("shows live points.");

    it("shows matches.");
    it("shows your selected team players.");
    it("shows top players.");

    it("shows live match details.");
    it("shows upcoming match details.");
    it("shows finished match details.");
    it("shows player details.");
  });

  describe("Next Gameweek", () => {
    it("shows countdown.");
    it("shows top transfer player.");

    it("shows gameweek matches.");

    it("remembers selected tab.");
  });
});
