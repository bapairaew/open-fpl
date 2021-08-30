describe("Player Statistics Explorer", () => {
  beforeEach(() => {
    cy.visit("/players");
  });

  describe("Table view", () => {
    beforeEach(() => {
      cy.get('[aria-label="search for players"]').as("searchInput");
      cy.get('[aria-label="players table"]').as("playersTable");
    });

    it("supports search.", () => {
      // Fuzzy search, should return more than 1 players
      cy.get("@searchInput").type("Fernandes").wait(300);
      cy.get("@playersTable")
        .find("tbody tr")
        .should("have.lengthOf.greaterThan", 1);

      // Exact search, should return only one player
      cy.get("@searchInput").clear().type("name:Fernandes").wait(300);
      cy.get("@playersTable").find("tbody tr").should("have.length", 1);

      // Exact cost
      cy.get("@searchInput").clear().type("cost:5.5").wait(300);
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(5)")
        .each((cell) => expect(+cell.text().replace(/£/, "")).to.eq(5.5));

      // Open range cost
      cy.get("@searchInput").clear().type("cost:<5.5").wait(300);
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(5)")
        .each((cell) => expect(+cell.text().replace(/£/, "")).to.be.lt(5.5));
      cy.get("@searchInput").clear().type("cost:<=5.5").wait(300);
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(5)")
        .each((cell) => expect(+cell.text().replace(/£/, "")).to.be.lte(5.5));
      cy.get("@searchInput").clear().type("cost:>11").wait(300);
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(5)")
        .each((cell) => expect(+cell.text().replace(/£/, "")).to.be.gt(11));
      cy.get("@searchInput").clear().type("cost:>=11").wait(300);
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(5)")
        .each((cell) => expect(+cell.text().replace(/£/, "")).to.be.gte(11));

      // Closed range cost
      cy.get("@searchInput").clear().type("cost:10-11").wait(300);
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(5)")
        .each((cell) =>
          expect(+cell.text().replace(/£/, "")).to.be.within(10, 11)
        );

      // Exact position
      cy.get("@searchInput").clear().type("position:MID").wait(300);
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(4)")
        .each((cell) => expect(cell).to.have.text("MID"));

      // Exact team
      cy.get("@searchInput").clear().type("team:MUN").wait(300);
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(3)")
        .each((cell) => expect(cell).to.have.text("MUN"));
    });

    it("disables dropdown sorting.", () => {
      cy.get('[aria-label="sort players"]').should("be.disabled");
    });

    it("supports sorting through header.", { scrollBehavior: false }, () => {
      // Sort simple field
      cy.get('[aria-label="name options"]').click();
      cy.get('[role="menu"]').get('button[value="desc"]').click();
      cy.get("@playersTable")
        .find("tbody tr th:nth-child(2)")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            expect(
              cell.text().localeCompare(list[index + 1].textContent)
            ).to.eq(1);
          }
        });
      cy.get('[aria-label="name options"]').click();
      cy.get('[role="menu"]').get('button[value="asc"]').click();
      cy.get("@playersTable")
        .find("tbody tr th:nth-child(2)")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            expect(
              cell.text().localeCompare(list[index + 1].textContent)
            ).to.eq(-1);
          }
        });

      // Reset sort
      cy.get('[aria-label="name options"]').click();
      cy.get('[aria-label="unsort name"]').click();

      // Sort series field
      cy.get('[aria-label="goals options"]').click({ force: true });
      cy.get('[role="menu"]').get('button[value="asc"]').click({ force: true });
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(9)")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            const current = cell
              .find('[aria-label^="goals against"]')
              .toArray()
              .map((d) => +(d.textContent || "0"))
              .reduce((sum, d) => sum + d, 0);
            const next = Cypress.$(list[index + 1])
              .find('[aria-label^="goals against"]')
              .toArray()
              .map((d) => +(d.textContent || "0"))
              .reduce((sum, d) => sum + d, 0);
            expect(current).to.lte(next);
          }
        });
      cy.get('[aria-label="goals options"]').click({ force: true });
      cy.get('[role="menu"]')
        .get('button[value="desc"]')
        .click({ force: true });
      cy.get("@playersTable")
        .find("tbody tr td:nth-child(9)")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            const current = cell
              .find('[aria-label^="goals against"]')
              .toArray()
              .map((d) => +(d.textContent || "0"))
              .reduce((sum, d) => sum + d, 0);
            const next = Cypress.$(list[index + 1])
              .find('[aria-label^="goals against"]')
              .toArray()
              .map((d) => +(d.textContent || "0"))
              .reduce((sum, d) => sum + d, 0);
            expect(current).to.gte(next);
          }
        });

      // Reset sort
      cy.get('[aria-label="goals options"]').click({ force: true });
      cy.get('[aria-label="unsort goals"]').click({ force: true });

      // Sort multi columns
      cy.get("@searchInput").clear().type("team:MUN").wait(300);
      cy.get('[aria-label="pos options"]').click({ force: true });
      cy.get('[role="menu"]')
        .get('button[value="desc"]')
        .click({ force: true });
      cy.get('[aria-label="points options"]').click({ force: true });
      cy.get('[role="menu"]')
        .get('button[value="desc"]')
        .click({ force: true });
      cy.get("@playersTable")
        .find("tbody tr")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            if (
              cell.find("td:nth-child(4)").text() ===
              Cypress.$(list[index + 1])
                .find("td:nth-child(4)")
                .text()
            ) {
              const current = cell
                .find('[aria-label^="points against"]')
                .toArray()
                .map((d) => +(d.textContent || "0"))
                .reduce((sum, d) => sum + d, 0);
              const next = Cypress.$(list[index + 1])
                .find('[aria-label^="points against"]')
                .toArray()
                .map((d) => +(d.textContent || "0"))
                .reduce((sum, d) => sum + d, 0);
              expect(current).to.gte(next);
            }
          }
        });
    });

    it("supports star players.", () => {
      cy.setUpProfile();
      cy.get("body").contains("Test account");

      // Star non-first player
      cy.get('button[aria-label="add star player"]')
        .eq(5)
        .click({ force: true });

      // Check if top row is starred then click
      cy.get("@playersTable")
        .find("tbody tr")
        .first()
        .find("th:nth-child(1) button")
        .should("have.attr", "aria-label", "remove star player");

      cy.get('button[aria-label="remove star player"]').click();

      // Check if there is no starred player
      cy.get("@playersTable")
        .find("tbody tr")
        .first()
        .find("th:nth-child(1) button")
        .should("not.have.attr", "aria-label", "remove star player");
    });

    it("shows Understat link.", () => {
      cy.get("@playersTable")
        .find("tbody tr th:nth-child(1) a")
        .should("have.attr", "href")
        .and("match", /https\:\/\/understat.com\/player\//);
    });

    it("shows compare player modal.", () => {
      cy.get("@playersTable")
        .find("tbody tr")
        .contains("Salah")
        .parentsUntil("tbody")
        .find('input[type="checkbox"]')
        .click({ force: true });
      cy.get("@playersTable")
        .find("tbody tr")
        .contains("Fernandes")
        .parentsUntil("tbody")
        .find('input[type="checkbox"]')
        .click({ force: true });
      cy.get("@playersTable")
        .find("tbody tr")
        .contains("Lukaku")
        .parentsUntil("tbody")
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
      cy.get('[aria-label="name options"]').click({ force: true });
      cy.get('[role="menu"]').get('button[value="desc"]').click();

      cy.reload();

      // Should be sorted by name after refresh
      cy.get("@playersTable")
        .find("tbody tr th:nth-child(2)")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            expect(
              cell.text().localeCompare(list[index + 1].textContent)
            ).to.eq(1);
          }
        });
    });
  });
});
