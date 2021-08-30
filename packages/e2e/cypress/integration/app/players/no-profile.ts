describe("Player Statistics Explorer", () => {
  beforeEach(() => {
    cy.visit("/players");
  });

  describe("No profile", () => {
    it("asks for profile if found an attemp to star a player", () => {
      cy.get('button[aria-label="add star player"]').eq(5).click();

      // Show toast if star player without profile
      cy.get("body")
        .contains("Please set up a profile to star a player.")
        .should("be.visible");
    });
  });
});
