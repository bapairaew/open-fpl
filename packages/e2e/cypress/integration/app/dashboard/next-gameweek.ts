describe("Dashboard", () => {
  describe("Next Gameweek", () => {
    describe("With no profile", () => {
      beforeEach(() => {
        cy.visit("/");
        cy.get('[aria-label="next gameweek"]').click();
      });

      it("shows player details.", () => {
        cy.get('[aria-labelledby="next-gameweek-top-transfers"]')
          .find('[role="listitem"] [aria-label="open player details"]')
          .first()
          .click({ force: true });
        cy.get('[role="dialog"]')
          .find('[aria-label="player statistics"]')
          .should("be.visible");
      });

      it("shows match details.", () => {
        // Show picked players and team strength
        cy.get(
          '[aria-labelledby="next-gameweek-fixtures"] [role="listitem"]'
        ).each((e) => {
          expect(
            +e
              .find('[aria-label="home team strength"]')
              .attr("aria-valuetext") +
              +e
                .find('[aria-label="away team strength"]')
                .attr("aria-valuetext")
          ).to.be.eq(100);
        });

        // Opens dialog with match details
        cy.get('[aria-labelledby="next-gameweek-fixtures"]')
          .find('[role="listitem"] [aria-label="open fixture details"]')
          .first()
          .click({ force: true });
        cy.get('[role="dialog"]').each((e) => {
          expect(
            +e
              .find('[aria-label="home team strength"]')
              .attr("aria-valuetext") +
              +e
                .find('[aria-label="away team strength"]')
                .attr("aria-valuetext")
          ).to.be.eq(100);
        });
        // TODO: refactor stats section and add test cases here
        cy.get('[role="dialog"]')
          .find('[aria-label="teams"]')
          .should("be.visible");
      });
    });

    describe("With real data", () => {
      beforeEach(() => {
        cy.visit("/");
        cy.setUpProfile();
        cy.get("aside").contains("Test account");
        cy.get('[aria-label="next gameweek"]').click();
      });

      it("shows gameweek matches.", () => {
        cy.get('[aria-labelledby="next-gameweek-fixtures"]')
          .find('[role="listitem"]')
          .should("have.length.above", 1);
        cy.get('[aria-label="selected players"] > div').should(
          "have.length.above",
          1
        );
      });

      it("remembers selected tab.", () => {
        cy.reload();
        cy.get('[aria-label="next gameweek dashboard"]')
          .contains("Next Gameweek deadline")
          .should("be.visible");
      });
    });

    describe("With mock data", () => {
      beforeEach(() => {
        cy.intercept("/_next/data/**/index.json", {
          fixture: "dashboard/all.json",
        }).as("getDashboardPageData");
        cy.intercept("/api/entries/4073", {
          fixture: "entries/general/main.json",
        }).as("getEntry");
        cy.intercept("/api/entries/4073/history", {
          fixture: "entries/history/main.json",
        }).as("getHistory");
        cy.intercept("/api/entries/4073/picks/3", {
          fixture: "entries/picks/all.json",
        }).as("getPicks");

        cy.visit("/");
        cy.setUpProfile();
        cy.get("aside").contains("Test account");
        cy.blurWindow();
        cy.get("aside").contains("Dashboard").click();
      });

      it("shows countdown.", () => {
        cy.get('[aria-label="next gameweek dashboard"]')
          .contains("Next Gameweek deadline")
          .next()
          .invoke("text")
          .should("match", /\d+/);
      });

      it("shows top transferred players.", () => {
        cy.get('[aria-label="next gameweek"]').click();
        cy.get('[aria-labelledby="next-gameweek-top-transfers"]')
          .find('[role="listitem"]')
          .should("have.length.gte", 1);
        cy.get('[aria-labelledby="next-gameweek-top-transfers"]')
          .find('[role="listitem"]')
          .each((e, index, list) => {
            if (index < list.length - 1) {
              const current = e
                .find('[aria-label="player cost changes"]')
                .attr("aria-valuetext")
                .replace(/£/g, "");
              const next = Cypress.$(list[index + 1])
                .find('[aria-label="player cost changes"]')
                .attr("aria-valuetext")
                .replace(/£/g, "");
              // Should sort by cost change
              expect(Math.abs(+current)).to.be.gte(Math.abs(+next));
            }
          });

        // Should show picked / live
        cy.get('[aria-labelledby="next-gameweek-top-transfers"]')
          .find('[role="listitem"] [aria-label="player status"]')
          .contains("Picked")
          .should("have.length.gte", 1);
        cy.get('[aria-labelledby="next-gameweek-top-transfers"]')
          .find('[role="listitem"] [aria-label="player status"]')
          .contains("Live")
          .should("have.length.gte", 1);

        // Should show all players
        cy.get('[id="next-gameweek-top-transfers"]')
          .contains("See all")
          .click();
        cy.get('[aria-label="top transferred players"]')
          .find("tbody tr td:nth-child(6)")
          .each((cell, index, list) => {
            if (index < list.length - 1) {
              const current = cell.text().match(/[\d.]+/)?.[0];
              const next = Cypress.$(list[index + 1])
                .text()
                .match(/[\d.]+/)?.[0];
              // Should sort by cost change
              expect(Math.abs(+current)).to.be.gte(Math.abs(+next));
            }
          });
      });
    });
  });
});
