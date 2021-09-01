describe("Dashboard", () => {
  describe("Current Gameweek", () => {
    describe("With no profile", () => {
      beforeEach(() => {
        cy.visit("/");
      });

      it("shows no points, and picked.", () => {
        cy.get('[aria-label="current gameweek dashboard"]')
          .contains("Picked")
          .should("not.exist");
        cy.get('[aria-label="current gameweek dashboard"]')
          .contains("Total points")
          .should("not.exist");
        cy.get('[aria-label="current gameweek dashboard"]')
          .contains("Overall rank")
          .should("not.exist");
      });
    });

    describe("With real data", () => {
      beforeEach(() => {
        cy.visit("/");
        cy.setUpProfile();
        cy.get("aside").contains("Test account");
      });

      it("shows your selected team players.", () => {
        cy.get('[aria-labelledby="your-team-section-header"]')
          .find('[role="listitem"]')
          .should("have.length", 15);
        cy.get('[aria-labelledby="your-team-section-header"]')
          .find('[role="listitem"]')
          .each((e, index, list) => {
            if (index < list.length - 1) {
              const current = e
                .find('[aria-label="player total points"]')
                .text();
              const next = Cypress.$(list[index + 1])
                .find('[aria-label="player total points"]')
                .text();
              // Should sort by total points
              expect(Math.abs(+current)).to.be.gte(Math.abs(+next));
            }
          });
        cy.get('[aria-labelledby="your-team-section-header"]')
          .find('[role="listitem"] [aria-label="open player details"]')
          .first()
          .click({ force: true });
        cy.get('[role="dialog"]')
          .find('[aria-label="player statistics"]')
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

      it("shows live points and rank.", () => {
        cy.get('[aria-label="current gameweek dashboard"]')
          .contains("Total points")
          .next()
          .should("have.text", "989")
          .next()
          .invoke("text")
          .should("match", /810/);
        cy.get('[aria-label="current gameweek dashboard"]')
          .contains("Overall rank")
          .next()
          .should("have.text", "303,985")
          .next()
          .invoke("text")
          .should("match", /114\,403/);
      });

      it("shows live/finished/upcoming fixtures.", () => {
        // Live matches should show minutes
        cy.get('[aria-labelledby="live-fixtures-header"]')
          .find('[role="listitem"]')
          .find('[aria-label="fixture minutes"]')
          .invoke("text")
          .should("match", /\d+/);

        // Live matches should show picked status
        cy.get(
          '[aria-labelledby="live-fixtures-header"] [role="listitem"] [aria-label="fixture status"] :contains("Picked")'
        ).should("have.length", 10);

        // Live matches and finished matches should show picked players
        cy.get(
          `
          [aria-labelledby="live-fixtures-header"] [role="listitem"] [aria-label="player statistics (in your team)"],
          [aria-labelledby="finished-fixtures-header"] [role="listitem"] [aria-label="player statistics (in your team)"]
        `
        ).should("have.length.gte", 7);

        // Finished match should show xg
        cy.get(
          '[aria-labelledby="finished-fixtures-header"] [role="listitem"] [aria-label="expected score"]'
        ).each((e) => {
          expect(e.text()).to.match(/\d+ - \d+/);
        });

        // Upcoming match should show strength, picked players
        cy.get(
          '[aria-labelledby="upcoming-fixtures-header"] [role="listitem"]'
        ).each((e) => {
          expect(
            +e
              .find('[aria-label="home team strength"]')
              .attr("aria-valuetext") +
              +e
                .find('[aria-label="away team strength"]')
                .attr("aria-valuetext")
          ).to.be.eq(100);
          expect(
            e.find(
              '[aria-label="home team"] [aria-label="selected players"] > *'
            ).length
          ).to.be.eq(3);
        });

        // Live/finished/upcoming should have 10 matches each (with mock data)
        cy.get('[aria-labelledby="live-fixtures-header"]')
          .find('[role="listitem"] > section')
          .should("have.length", 10);
        cy.get('[aria-labelledby="finished-fixtures-header"]')
          .find('[role="listitem"] > section')
          .should("have.length", 10);
        cy.get('[aria-labelledby="upcoming-fixtures-header"]')
          .find('[role="listitem"] > section')
          .should("have.length", 10);

        // Live match should show dialog with minutes, picked status, goals and assists (with mock data)
        cy.get('[aria-labelledby="live-fixtures-header"]')
          .find('[role="listitem"]')
          .first()
          .click();
        cy.get('[role="dialog"] [aria-label="fixture minutes"]').should(
          "be.visible"
        );
        cy.get(
          '[role="dialog"] [aria-label="fixture status"] :contains("Picked")'
        ).should("be.visible");
        cy.get(
          '[role="dialog"] [aria-label="player statistics (in your team)"]'
        ).should("have.length.gte", 7);
        cy.get(
          '[role="dialog"] [aria-label="player statistics (in your team)"] [aria-label="goals"]'
        ).each((element) => {
          const count = +element.attr("aria-valuetext");
          const childrenCount = element.children().length;
          expect(count).to.be.eq(childrenCount);
        });
        cy.get(
          '[role="dialog"] [aria-label="player statistics (in your team)"] [aria-label="assists"]'
        ).each((element) => {
          const count = +element.attr("aria-valuetext");
          const childrenCount = element.children().length;
          expect(count).to.be.eq(childrenCount);
        });
        cy.get('[role="dialog"] [aria-label="Close"]').click({
          force: true,
        });

        // Finished match should sohw dialog with understat links and minutes and picked status (with mock data)
        cy.get('[aria-labelledby="finished-fixtures-header"]')
          .find('[role="listitem"]')
          .first()
          .click();
        cy.get('[role="dialog"]')
          .find('[aria-label="fixture minutes"]')
          .should("not.exist");
        cy.get('[role="dialog"]')
          .find('[aria-label="fixture status"] :contains("Picked")')
          .should("be.visible");
        cy.get(
          '[role="dialog"] [aria-label="player statistics (in your team)"]'
        ).should("have.length.gte", 7);
        cy.get(
          '[role="dialog"] [aria-label="player statistics (in your team)"] [aria-label="goals"]'
        ).each((element) => {
          const count = +element.attr("aria-valuetext");
          const childrenCount = element.children().length;
          expect(count).to.be.eq(childrenCount);
        });
        cy.get(
          '[role="dialog"] [aria-label="player statistics (in your team)"] [aria-label="assists"]'
        ).each((element) => {
          const count = +element.attr("aria-valuetext");
          const childrenCount = element.children().length;
          expect(count).to.be.eq(childrenCount);
        });
        cy.get('a[href^="https://understat.com/match/"]').should("be.visible");
        cy.get('[role="dialog"] [aria-label="expected score"]').should(
          "have.length",
          2
        );
        cy.get('[role="dialog"] [aria-label="Close"]').click({
          force: true,
        });

        // Upcoming match should sohw dialog with team strength (with mock data)
        cy.get('[aria-labelledby="upcoming-fixtures-header"]')
          .find('[role="listitem"]')
          .first()
          .click();
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
        cy.get('[role="dialog"] [aria-label="Close"]').click({
          force: true,
        });
      });

      it("shows top players.", () => {
        cy.get('[aria-labelledby="top-players-section-header"]')
          .find('[role="listitem"]')
          .should("have.length.gte", 1);
        cy.get('[aria-labelledby="top-players-section-header"]')
          .find('[role="listitem"]')
          .each((e, index, list) => {
            if (index < list.length - 1) {
              const current = e
                .find('[aria-label="player total points"]')
                .text();
              const next = Cypress.$(list[index + 1])
                .find('[aria-label="player total points"]')
                .text();
              // Should sort by total points
              expect(Math.abs(+current)).to.be.gte(Math.abs(+next));
            }
          });
        cy.get('[aria-labelledby="top-players-section-header"]')
          .find('[role="listitem"] [aria-label="open player details"]')
          .first()
          .click({ force: true });
        cy.get('[role="dialog"]')
          .find('[aria-label="player statistics"]')
          .should("be.visible");
      });
    });
  });
});
