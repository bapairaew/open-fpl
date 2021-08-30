describe("Player Statistics Explorer", () => {
  beforeEach(() => {
    cy.visit("/players");
  });

  describe("Mobile", () => {
    beforeEach(() => {
      cy.viewport("iphone-x");
    });

    it("shows app drawer.", () => {
      cy.get('[aria-label="open app drawer"]').should("be.visible");
    });

    it("shows only display options on table view mode.", () => {
      cy.get('[aria-label="sort and display options"]').click();

      // Sort options should be hidden from the menu
      cy.get('[role="menu"]')
        .find('button[value="best-xgi"]')
        .should("not.exist");

      // While display options should be shown
      cy.get('[role="menu"]').find('button[value="grid"]').should("be.visible");
    });

    it("shows display and sort options on other view modes and can sort.", () => {
      cy.get('[aria-label="sort and display options"]').click();
      cy.get('[role="menu"]').find('button[value="grid"]').click();
      cy.get('[aria-label="sort and display options"]').click();

      // Sort options should be shown
      cy.get('[role="menu"]')
        .find('button[value="best-xgi"]')
        .should("be.visible")
        .click();

      // Sort options should sort the results
      cy.get('[aria-label="player statistics"]').each((card, index, list) => {
        if (index < list.length - 1) {
          const current = card
            .find('[aria-label^="xgi against"]')
            .toArray()
            .map((d) => +(d.textContent || "0"))
            .reduce((sum, d) => sum + d, 0);
          const next = Cypress.$(list[index + 1])
            .find('[aria-label^="xgi against"]')
            .toArray()
            .map((d) => +(d.textContent || "0"))
            .reduce((sum, d) => sum + d, 0);
          expect(current).to.gte(next);
        }
      });
    });
  });
});
