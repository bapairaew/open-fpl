describe("Help", () => {
  beforeEach(() => {
    cy.visit("/help");
  });

  it("navigates through tabs.", () => {
    cy.get("main").contains("Dashboard").click();
    cy.url().should("include", "/help/dashboard");

    cy.get("main").contains("Player Explorer").click();
    cy.url().should("include", "/help/players");

    cy.get("main").contains("Team Planner").click();
    cy.url().should("include", "/help/teams");

    cy.get("main").contains("Fixtures").click();
    cy.url().should("include", "/help/fixtures");

    cy.get("main").contains("Find your ID").click();
    cy.url().should("include", "/help/id");
  });

  describe("Mobile", () => {
    beforeEach(() => {
      cy.viewport("iphone-x");
    });

    it("shows app drawer.", () => {
      cy.get('[aria-label="open app drawer"]').should("be.visible");
    });
  });
});
