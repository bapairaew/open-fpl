describe("Teams Planner", () => {
  describe("Transfer market", () => {
    beforeEach(() => {
      cy.intercept("/_next/data/**/teams/4073.json", {
        fixture: "teams/4073.json",
      });
      cy.visit("/teams");
      cy.setUpProfile();
      cy.visit("/teams/4073");

      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Sánchez")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer"]')
        .click();
    });

    it("shows selected players, selectable players, and disables already in team.", () => {
      // Show selected player
      cy.get('[aria-label="transfer market"]')
        .find("table thead tr:nth-child(2) th:nth-child(2)")
        .each((cell) => expect(cell).to.have.text("Sánchez"));

      // Show correct position
      cy.get('[aria-label="transfer market"]')
        .find("table tbody tr td:nth-child(4)")
        .each((cell) => expect(cell).to.have.text("GKP"));

      // Disable already in team
      cy.get('[aria-label="transfer market"]')
        .find('[aria-label="search for players"]')
        .type("Begović")
        .wait(300);
      cy.get('[aria-label="transfer market"]')
        .find(
          'table tbody tr th:nth-child(1) [aria-label="player is already in the team"]'
        )
        .should("exist");
    });

    it("sorts players.", { scrollBehavior: false }, () => {
      cy.get('[aria-label="transfer market"]')
        .find('[aria-label="name options"]')
        .click();
      cy.get('[role="menu"]').get('button[value="desc"]').click();
      cy.get('[aria-label="transfer market"]')
        .find("tbody tr th:nth-child(2)")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            expect(
              cell.text().localeCompare(list[index + 1].textContent)
            ).to.eq(1);
          }
        });
      cy.get('[aria-label="transfer market"]')
        .find('[aria-label="name options"]')
        .click();
      cy.get('[role="menu"]').get('button[value="asc"]').click();
      cy.get('[aria-label="transfer market"]')
        .find("tbody tr th:nth-child(2)")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            expect(
              cell.text().localeCompare(list[index + 1].textContent)
            ).to.eq(-1);
          }
        });
    });

    it("filters players.", () => {
      cy.get('[aria-label="transfer market"]')
        .find('[aria-label="search for players"]')
        .clear()
        .type("cost:5.5")
        .wait(300);
      cy.get('[aria-label="transfer market"]')
        .find("tbody tr td:nth-child(5)")
        .each((cell) => expect(+cell.text().replace(/£/, "")).to.eq(5.5));
    });
  });
});
