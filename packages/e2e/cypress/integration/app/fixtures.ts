describe("Fixture Difficulty Rating", () => {
  beforeEach(() => {
    cy.visit("/fixtures");
    cy.get('[aria-label="fixtures table"]').as("fixturesTable");
  });

  describe("Fixtures Table", () => {
    it.skip("shows 20 teams with 38 fixtures each.", () => {
      cy.get("@fixturesTable").find("tbody tr").should("have.length", 20);

      cy.get("@fixturesTable").find("tbody tr").find("td");

      cy.get("@fixturesTable")
        .find("tbody tr")
        .each((row) => {
          expect(row.find('[aria-label^="difficulty level"]').length).to.be.eq(
            38
          );

          const countMap = {};
          const cells = row
            .find("td")
            .map((i, d) => d.textContent)
            .toArray();

          let max = 0;
          for (const cell of cells) {
            const team = cell.toLowerCase();
            if (countMap[team]) countMap[team] += 1;
            else countMap[team] = 1;
            if (countMap[team] > max) max = countMap[team];
          }

          // Teams should only play other same team twice
          expect(max).to.be.eq(2);
        });
    });

    it.skip("shows team strength popover.", { scrollBehavior: false }, () => {
      cy.get("@fixturesTable")
        .find('[aria-label="click to see Chelsea strength"]')
        .first()
        .click();
      cy.get("body")
        .find('[role="dialog"]')
        .contains("Chelsea")
        .should("be.visible");
    });

    it.skip("shows compare team strength popover.", () => {
      cy.get("@fixturesTable")
        .find('[aria-label="click to compare Arsenal and Chelsea strength"]')
        .first()
        .click();
      cy.get("body")
        .find('[role="dialog"]')
        .contains("ARS vs CHE")
        .should("be.visible");
    });

    it.skip("dims past gameweeks.", () => {
      // get next gameweek id
      cy.request(
        "https://fantasy.premierleague.com/api/bootstrap-static/"
      ).then((response) => {
        const nextGameweek = response.body.events.find((e) => e.is_next).id;

        cy.get("@fixturesTable")
          .find("tbody tr")
          .each((row) => {
            row.find("td").each((index, cell) => {
              const opacity = +Cypress.$(cell).css("opacity");
              if (index + 1 < nextGameweek) expect(opacity).to.be.lt(1);
              else expect(opacity).to.be.eq(1);
            });
          });
      });
    });

    it.skip(
      "supports attack and defense modes.",
      { scrollBehavior: false },
      () => {
        const attackRating = [];
        const defenseRating = [];

        cy.get("@fixturesTable")
          .find("tbody tr td > div")
          .each((cell) => {
            attackRating.push(cell.css("background-color"));
          });
        cy.get('[aria-label="difficulty rating mode"]')
          .get('input[type="radio"]')
          .check("defence", { force: true });
        cy.get("@fixturesTable")
          .find("tbody tr td > div")
          .each((cell) => {
            defenseRating.push(cell.css("background-color"));
          })
          .then(() => {
            expect(
              attackRating.some(
                (attack, index) => attack !== defenseRating[index]
              )
            ).to.be.true;
          });
      }
    );

    it.skip("supports manual teams sort.", { scrollBehavior: false }, () => {
      let sourceIndex = 0;
      cy.get("@fixturesTable")
        .find("tbody tr")
        .each((row, index) => {
          if (row.find("th").text().match(/CHE/)) {
            sourceIndex = index + 1;
          }
        })
        .then(() => {
          cy.get(
            `[aria-label="fixtures table"] tbody tr:nth-child(${sourceIndex}) .handle`
          ).drag('[aria-label="fixtures table"] tbody tr:nth-child(1)', {
            force: true,
          });

          cy.get("@fixturesTable")
            .find("tbody tr:nth-child(1) th")
            .should("contain.text", "CHE");
        });
    });

    it.skip("supports single gameweek sort.", () => {
      cy.get("@fixturesTable")
        .find('[aria-label="Gameweek 1 sort options"]')
        .click();
      cy.get('[role="menu"]').contains("Easy fixture first").click();

      cy.get("@fixturesTable")
        .find("tbody tr td:nth-child(2)")
        .each((cell, index, list) => {
          if (index < list.length - 1) {
            const current = cell
              .find('[aria-label^="difficulty level"]')
              .attr("aria-label")
              .match(/difficulty level (\d) against/)?.[1];
            const next = Cypress.$(list[index + 1])
              .find('[aria-label^="difficulty level"]')
              .attr("aria-label")
              .match(/difficulty level (\d) against/)?.[1];
            expect(+current).to.be.lte(+next);
          }
        });
    });

    it.skip("supports range gameweeks sort.", () => {
      cy.get("@fixturesTable")
        .find('[aria-label="Gameweek 1 sort options"]')
        .click();
      cy.get('[role="menu"]').contains("Easy first from here...").click();
      cy.get("@fixturesTable")
        .find('[aria-label="Gameweek 3 sort options"]')
        .click();
      cy.get('[role="menu"]').contains("Easy first from GW 1").click();

      cy.get("@fixturesTable")
        .find("tbody tr")
        .each((row, index, list) => {
          if (index < list.length - 1) {
            let current = 0;
            row.find("td").each((index, cell) => {
              if (index < 3) {
                const matched = Cypress.$(cell)
                  .find('[aria-label^="difficulty level"]')
                  .attr("aria-label")
                  .match(/difficulty level (\d) against/)?.[1];
                current += +matched;
              }
            });

            let next = 0;
            Cypress.$(list[index + 1])
              .find("td")
              .each((index, cell) => {
                if (index < 3) {
                  const matched = Cypress.$(cell)
                    .find('[aria-label^="difficulty level"]')
                    .attr("aria-label")
                    .match(/difficulty level (\d) against/)?.[1];
                  next += +matched;
                }
              });

            expect(current).to.be.lte(next);
          }
        });
    });

    it("supports customisable team strength.", { retries: 0 }, () => {
      cy.setUpProfile();

      cy.get("@fixturesTable")
        .find("tbody tr:first-child td:nth-child(2)")
        .then((cell) => {
          const teamMatched = cell
            .find('[aria-label^="click to compare"]')
            .attr("aria-label")
            .match(/click to compare (\w+) and (\w+) strength/);
          const team = teamMatched?.[1];

          const beforeDifficultyMatched = cell
            .find('[aria-label^="difficulty level"]')
            .attr("aria-label")
            .match(/difficulty level (\d+)/);
          const beforeDifficulty = beforeDifficultyMatched?.[1];

          cy.get("button").contains("Edit Teams Strength").click();

          cy.get(`[aria-label="adjust ${team} strength"]`)
            .find('[aria-label="Home Attack Strength"]')
            .focus()
            .type("{home}", {
              waitForAnimations: true,
              animationDistanceThreshold: 20,
            });

          cy.get(`[aria-label="adjust ${team} strength"]`)
            .find('[aria-label="Away Attack Strength"]')
            .focus()
            .type("{home}", {
              waitForAnimations: true,
              animationDistanceThreshold: 20,
            })
            .then(() => {
              const afterDifficultyMatched = cell
                .find('[aria-label^="difficulty level"]')
                .attr("aria-label")
                .match(/difficulty level (\d+)/);
              const afterDifficulty = afterDifficultyMatched?.[1];

              expect(+beforeDifficulty).to.be.lte(+afterDifficulty);
            });
        });
    });

    it("remebers sort perference.");
  });

  describe.skip("Mobile", () => {
    beforeEach(() => {
      cy.viewport("iphone-x");
    });

    it("shows app drawer.", () => {
      cy.get('[aria-label="open app drawer"]').should("be.visible");
    });

    it("open team strength modal.");

    it("changes modes");
  });
});