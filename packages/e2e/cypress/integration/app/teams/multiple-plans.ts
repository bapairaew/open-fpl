describe("Teams Planner", () => {
  describe("Multiple plans", () => {
    beforeEach(() => {
      cy.intercept("/_next/data/**/teams/4073.json", {
        fixture: "teams/4073.json",
      });
      cy.visit("/teams");
      cy.setUpProfile("profiles/with-multiple-plans.json");
      cy.visit("/teams/4073");
    });

    it("manages team plans.", () => {
      // Add
      cy.get('[aria-label="team plans"]')
        .find('[aria-label="add a new plan"]')
        .click();
      cy.get('[role="tab"]').contains("Plan 4").should("exist");

      // Duplicate
      cy.get('[aria-label="team plans"]')
        .find('[role="tab"]')
        .first()
        .find('[aria-label="open team plan menu"]')
        .click();
      cy.get('[role="menu"]').find("button").contains("Duplicate").click();
      cy.get('[aria-label="gameweeks changes"]:visible')
        .contains("GW 4")
        .should("be.visible");

      // Rename
      cy.get('[aria-label="team plans"]')
        .find('[role="tab"]')
        .first()
        .find('[aria-label="open team plan menu"]')
        .click();
      cy.get('[role="menu"]').find("button").contains("Rename").click();
      cy.get('[aria-label="team plans"]')
        .find('[role="tab"] form')
        .first()
        .find('input[name="name"]')
        .type("Edited Name{enter}");
      cy.get('[role="tab"]').contains("Edited Name").should("exist");

      // Delete
      cy.get('[aria-label="team plans"]')
        .find('[role="tab"]')
        .first()
        .find('[aria-label="open team plan menu"]')
        .click();
      cy.get('[role="menu"]').find("button").contains("Remove").click();
      cy.get('[role="alertdialog"]').find("button").contains("Remove").click();
      cy.get('[role="tab"]').contains("Edited Name").should("not.exist");

      // Rearrange
      cy.get('[role="tab"]:first-child').drag('[role="tab"]:nth-child(2)', {
        force: true,
      });
      cy.get('[aria-label="team plans"]')
        .find('[role="tab"]')
        .first()
        .contains("Plan 3")
        .should("exist");

      // Remembers previous settings
      cy.reload();
      cy.get('[aria-label="team plans"]')
        .find('[role="tab"]')
        .first()
        .contains("Plan 3")
        .should("exist");
      cy.get('[aria-label="team plans"]')
        .find('[role="tab"]')
        .eq(1)
        .contains("Plan 2")
        .should("exist");
    });
  });
});
