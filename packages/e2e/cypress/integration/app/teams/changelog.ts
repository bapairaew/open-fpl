describe("Teams Planner", () => {
  describe("Changelog", () => {
    beforeEach(() => {
      cy.intercept("/_next/data/**/teams/4073.json", {
        fixture: "teams/4073.json",
      });
      cy.visit("/teams");
      cy.setUpProfile();
      cy.visit("/teams/4073");
    });

    it("displays team changes.", () => {
      // Captaincy changes and transfers
      cy.get('[aria-label="gameweeks changes"]')
        .contains("GW 4")
        .should("exist");
      cy.get('[aria-labelledby="changelog-gameweek-changes-4"]')
        .find('[aria-label="captain change"]')
        .contains("Sánchez")
        .should("exist");
      cy.get('[aria-labelledby="changelog-gameweek-changes-4"]')
        .find('[aria-label="transfer change"]')
        .should("exist")
        .find('[aria-label="transfer out player"]')
        .next()
        .contains("Alexander-Arnold")
        .should("exist")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer in player"]')
        .next()
        .contains("James")
        .should("exist");

      // Substitution changes and triple captain
      cy.get('[aria-label="gameweeks changes"]')
        .contains("GW 5")
        .should("exist");
      cy.get('[aria-labelledby="changelog-gameweek-changes-5"]')
        .find('[aria-label="swap change"]')
        .should("exist")
        .find('[aria-label="substitute out player"]')
        .next()
        .contains("Ings")
        .should("exist")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute in player"]')
        .next()
        .contains("White")
        .should("exist");
      cy.get('[aria-labelledby="changelog-gameweek-changes-5"]')
        .contains("Triple Captain")
        .should("exist");

      // Bench Boost
      cy.get('[aria-label="gameweeks changes"]')
        .contains("GW 6")
        .should("exist");
      cy.get('[aria-labelledby="changelog-gameweek-changes-6"]')
        .contains("Bench Boost")
        .should("exist");

      // Skip one week
      cy.get('[aria-label="gameweeks changes"]')
        .contains("GW 8")
        .should("exist");
      cy.get('[aria-labelledby="changelog-gameweek-changes-8"]')
        .find('[aria-label="transfer change"]')
        .should("exist")
        .find('[aria-label="transfer out player"]')
        .next()
        .contains("James")
        .should("exist")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer in player"]')
        .next()
        .contains("Rüdiger")
        .should("exist");
    });

    it("removes team changes.", () => {
      cy.get('[aria-labelledby="changelog-gameweek-changes-4"]')
        .find('[aria-label="transfer change"]')
        .should("exist")
        .find('[aria-label="transfer out player"]')
        .next()
        .contains("Alexander-Arnold")
        .should("exist")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="remove team change"]')
        .click();
      cy.get('[role="tabpanel"]')
        .find('[aria-label="selected team"]')
        .contains("Starting XI")
        .parentsUntil("section")
        .parent()
        .contains("Alexander-Arnold")
        .should("exist");
    });

    it("jumps to a specific gameweek.", () => {
      cy.get('[aria-label="gameweeks changes"]')
        .find("button")
        .contains("GW 6")
        .click();
      cy.get('[aria-label="gameweek navigator"]')
        .contains("Gameweek 6")
        .should("be.visible");
    });

    it("supports summary modal.", () => {
      cy.get('[aria-label="open team changelog menu"]').click();
      cy.get('[role="menu"]').find("button").contains("View summary").click();
      cy.get("#team-summary-modal-header-4").should("be.visible");
      cy.get('[aria-label="gameweek 4 changes"]')
        .should("be.visible")
        .find('[aria-label="captain player"]')
        .should("be.visible")
        .next()
        .contains("James")
        .should("be.visible");
    });
  });
});
