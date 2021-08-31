describe("Teams Planner", () => {
  describe("Mobile", () => {
    beforeEach(() => {
      cy.viewport("iphone-x");
    });

    it("shows app drawer.", () => {
      it("shows app drawer.", () => {
        cy.get('[aria-label="open app drawer"]').should("be.visible");
      });
    });

    it("manages team plans.", () => {
      cy.intercept("/_next/data/**/teams/4073.json", {
        fixture: "teams/4073.json",
      });
      cy.visit("/teams");
      cy.setUpProfile("profiles/with-multiple-plans.json");
      cy.visit("/teams/4073");

      // Add
      cy.get('[aria-label="open plan options"]').click();
      cy.get('[role="dialog"]')
        .find("button")
        .contains("Add a new plan")
        .click();
      cy.get('[role="radiogroup"]').find('[value="Plan 4"]').should("exist");

      // Duplicate
      cy.get('[role="radiogroup"]')
        .find('[data-id="Main Plan"] [aria-label="open team plan menu"]')
        .click();
      cy.get('[role="menu"]').find("button").contains("Duplicate").click();
      cy.get('[role="dialog"]').find('button[aria-label="Close"]').click();
      cy.get('[aria-label="gameweeks changes"]:visible')
        .contains("GW 4")
        .should("be.visible");

      // Rename
      cy.get('[aria-label="open plan options"]').click();
      cy.get('[role="radiogroup"]')
        .find('[data-id="Main Plan"] [aria-label="open team plan menu"]')
        .click();
      cy.get('[role="menu"]').find("button").contains("Rename").click();
      cy.get("#rename-team-plan-form")
        .find("#plan-name")
        .clear()
        .type("Edited Name{enter}");
      cy.get('[role="radiogroup"]')
        .find('[data-id="Edited Name"]')
        .should("exist");

      // Delete
      cy.get('[role="radiogroup"]')
        .find('[data-id="Edited Name"] [aria-label="open team plan menu"]')
        .click();
      cy.get('[role="menu"]').find("button").contains("Remove").click();
      cy.get('[role="alertdialog"]').find("button").contains("Remove").click();
      cy.get('[role="tab"]').contains("Edited Name").should("not.exist");

      // Rearrange
      cy.get('[aria-label="drag to rearrange Plan 2"]').drag(
        '[role="radiogroup"] [data-id="Plan 3"]',
        {
          position: "center",
          force: true,
        }
      );
      cy.get('[role="radiogroup"] input').each((e, i) => {
        if (i === 0) {
          expect(e.val()).to.equal("Plan 3");
        } else if (i === 1) {
          expect(e.val()).to.equal("Plan 2");
        }
      });

      // Remembers previous settings
      cy.reload();
      cy.get('[aria-label="open plan options"]').click();
      cy.get('[role="radiogroup"] input').each((e, i) => {
        if (i === 0) {
          expect(e.val()).to.equal("Plan 3");
        } else if (i === 1) {
          expect(e.val()).to.equal("Plan 2");
        }
      });
    });
  });
});
