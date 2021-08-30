describe("Teams Planner", () => {
  describe("Empty profile", () => {
    beforeEach(() => {
      cy.visit("/teams");
    });

    it("asks users to set up a profile.", () => {
      cy.get("main")
        .find("button")
        .contains("Set up your profile")
        .should("be.visible");
    });

    it("redirects to the team specific page once profile set up.", () => {
      cy.get("aside").contains("Set up your profile").click();
      cy.get("#profile").type("4073{enter}");
      cy.get('[aria-label="select a profile"]')
        .contains("Team ID: 4073")
        .should("be.visible");
      cy.get('[role="dialog"]')
        .find("header")
        .contains("Profiles")
        .parent()
        .find('> [aria-label="Close"]')
        .click();
      cy.url().should("include", "/teams/4073");
    });
  });
});
