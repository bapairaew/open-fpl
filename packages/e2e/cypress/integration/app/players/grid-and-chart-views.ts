describe("Player Statistics Explorer", () => {
  beforeEach(() => {
    cy.visit("/players");
  });

  describe("Card and Chart view", () => {
    beforeEach(() => {
      cy.get('[aria-label="search for players"]').as("searchInput");
      cy.get('[aria-label="select display options"]').select("grid");
    });

    it("supports search.", () => {
      // Fuzzy search, should return more than 1 players
      cy.get("@searchInput").type("Fernandes").wait(300);
      cy.get('[aria-label="player statistics"]').should(
        "have.lengthOf.greaterThan",
        1
      );

      // // Exact search, should return only one player
      cy.get("@searchInput").clear().type("name:Fernandes").wait(300);
      cy.get('[aria-label="player statistics"]').should("have.length", 1);

      // // Exact cost
      cy.get("@searchInput").clear().type("cost:5.5").wait(300);
      cy.get('[aria-label="player cost"]').each((cell) =>
        expect(+cell.text().replace(/£/, "")).to.eq(5.5)
      );

      // Open range cost
      cy.get("@searchInput").clear().type("cost:<5.5").wait(300);
      cy.get('[aria-label="player cost"]').each((cell) =>
        expect(+cell.text().replace(/£/, "")).to.be.lt(5.5)
      );
      cy.get("@searchInput").clear().type("cost:<=5.5").wait(300);
      cy.get('[aria-label="player cost"]').each((cell) =>
        expect(+cell.text().replace(/£/, "")).to.be.lte(5.5)
      );
      cy.get("@searchInput").clear().type("cost:>11").wait(300);
      cy.get('[aria-label="player cost"]').each((cell) =>
        expect(+cell.text().replace(/£/, "")).to.be.gt(11)
      );
      cy.get("@searchInput").clear().type("cost:>=11").wait(300);
      cy.get('[aria-label="player cost"]').each((cell) =>
        expect(+cell.text().replace(/£/, "")).to.be.gte(11)
      );

      // Closed range cost
      cy.get("@searchInput").clear().type("cost:10-11").wait(300);
      cy.get('[aria-label="player cost"]').each((cell) =>
        expect(+cell.text().replace(/£/, "")).to.be.within(10, 11)
      );

      // Exact position
      cy.get("@searchInput").clear().type("position:MID").wait(300);
      cy.get('[aria-label="player position"]').each((cell) =>
        expect(cell).to.have.text("MID")
      );

      // Exact team
      cy.get("@searchInput").clear().type("team:MUN").wait(300);
      cy.get('[aria-label="player team"]').each((cell) =>
        expect(cell).to.have.text("MUN")
      );
    });

    it("supports sorting.", () => {
      // Combined field
      cy.get('[aria-label="sort players"]').select("best-xgi");
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

      // Simple field
      cy.get('[aria-label="sort players"]').select("best-xga");
      cy.get('[aria-label="player statistics"]').each((card, index, list) => {
        if (index < list.length - 1) {
          const current = card
            .find('[aria-label^="xga against"]')
            .toArray()
            .map((d) => +(d.textContent || "0"))
            .reduce((sum, d) => sum + d, 0);
          const next = Cypress.$(list[index + 1])
            .find('[aria-label^="xga against"]')
            .toArray()
            .map((d) => +(d.textContent || "0"))
            .reduce((sum, d) => sum + d, 0);
          expect(current).to.lte(next);
        }
      });

      // Series field
      cy.get('[aria-label="sort players"]').select("ownership-desc");
      cy.get('[aria-label="player statistics"]').each((card, index, list) => {
        if (index < list.length - 1) {
          const current = card
            .find('[aria-label^="player ownership"]')
            .toArray()
            .map((d) => +(d.textContent || "0").replace(/\%/g, ""))
            .reduce((sum, d) => sum + d, 0);
          const next = Cypress.$(list[index + 1])
            .find('[aria-label^="player ownership"]')
            .toArray()
            .map((d) => +(d.textContent || "0").replace(/\%/g, ""))
            .reduce((sum, d) => sum + d, 0);
          expect(current).to.gte(next);
        }
      });
    });

    it("shows Understat link.", () => {
      cy.get('[aria-label="player statistics"]')
        .find("a")
        .should("have.attr", "href")
        .and("match", /https\:\/\/understat.com\/player\//);
    });

    it("supports star players.", () => {
      cy.setUpProfile("profiles/with-no-starred-players.json");
      cy.get("body").contains("Test account");

      // Star non-first player
      cy.get('button[aria-label="add star player"]')
        .eq(2)
        .click({ force: true });

      // Check if top row is starred then click
      cy.get('[aria-label="player statistics"]')
        .first()
        .find("button")
        .should("have.attr", "aria-label", "remove star player");

      cy.get('button[aria-label="remove star player"]').click();

      // Check if there is no starred player
      cy.get('button[aria-label="remove star player"]').should("not.exist");
    });

    it("shows compare player modal.", () => {
      cy.get('[aria-label="player statistics"]')
        .contains("Salah")
        .parentsUntil('[aria-label="player statistics"]')
        .parent()
        .find('input[type="checkbox"]')
        .click({ force: true });
      cy.get('[aria-label="player statistics"]')
        .contains("Fernandes")
        .parentsUntil('[aria-label="player statistics"]')
        .parent()
        .find('input[type="checkbox"]')
        .click({ force: true });
      cy.get('[aria-label="player statistics"]')
        .contains("Lukaku")
        .parentsUntil('[aria-label="player statistics"]')
        .parent()
        .find('input[type="checkbox"]')
        .click({ force: true });
      cy.get("button").contains("Compare").click();

      // 3 selected players name should be shown
      cy.get('[role="dialog"]')
        .find("th")
        .contains("Salah")
        .should("be.visible");
      cy.get('[role="dialog"]')
        .find("th")
        .contains("Fernandes")
        .should("be.visible");
      cy.get('[role="dialog"]')
        .find("th")
        .contains("Lukaku")
        .should("be.visible");
    });

    it("remebers view and sort perference.", () => {
      cy.get('[aria-label="select display options"]').select("grid");
      cy.get('[aria-label="sort players"]').select("best-xga");

      cy.reload();

      // Should be sorted by xga even after refresh
      cy.get('[aria-label="player statistics"]').each((card, index, list) => {
        if (index < list.length - 1) {
          const current = card
            .find('[aria-label^="xga against"]')
            .toArray()
            .map((d) => +(d.textContent || "0"))
            .reduce((sum, d) => sum + d, 0);
          const next = Cypress.$(list[index + 1])
            .find('[aria-label^="xga against"]')
            .toArray()
            .map((d) => +(d.textContent || "0"))
            .reduce((sum, d) => sum + d, 0);
          expect(current).to.lte(next);
        }
      });
    });
  });
});
