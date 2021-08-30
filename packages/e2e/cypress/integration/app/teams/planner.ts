describe("Teams Planner", () => {
  describe("Planner", () => {
    beforeEach(() => {
      cy.intercept("/_next/data/**/teams/4073.json", {
        fixture: "teams/4073.json",
      });
      cy.visit("/teams");
      cy.setUpProfile();
      cy.visit("/teams/4073").then(() => {
        window.localStorage.setItem("4073-team-plan-Main Plan", "[]");
      });
    });

    it("transfers players.", () => {
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Sánchez")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer"]')
        .click();

      // Recalculate Bank, Free, Hits
      cy.get('[aria-label="transfer market"]')
        .find('[aria-label="search for players"]')
        .clear()
        .type("cost:>5")
        .wait(300);
      cy.get('[aria-label="transfer market"]')
        .find('table tbody tr th:nth-child(1) [aria-label="transfer player"]')
        .first()
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Brownhill")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer"]')
        .click();
      cy.get('[aria-label="transfer market"]')
        .find('[aria-label="search for players"]')
        .type("cost:>5", { waitForAnimations: true })
        .wait(300);
      cy.get('[aria-label="transfer market"]')
        .find('table tbody tr th:nth-child(1) [aria-label="transfer player"]')
        .first()
        .click({ force: true });
      cy.get('[aria-label="team planner toolbar"]')
        .find("section")
        .contains("Bank")
        .next()
        .should((p) => (+p.text().match(/(\d+)/)?.[1] ?? 100) < 1.4);
      cy.get('[aria-label="team planner toolbar"]')
        .find("section")
        .contains("Free")
        .next()
        .should((p) => (+p.text().match(/(\d+)/)?.[1] ?? 100) === 0);
      cy.get('[aria-label="team planner toolbar"]')
        .find("section")
        .contains("Bank")
        .next()
        .should((p) => (+p.text().match(/(\d+)/)?.[1] ?? 100) === -1);
    });

    it("supports future gameweeks.", () => {
      // Able to make future transfer
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Greenwood")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer"]')
        .click();
      cy.get('[aria-label="transfer market"]')
        .find('table tbody tr th:nth-child(1) [aria-label="transfer player"]')
        .first()
        .click({ force: true });
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Greenwood")
        .should("not.exist");
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to previous gameweek"]')
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Greenwood")
        .should("exist");

      // Able to make future substitution
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Fernandes")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Brownhill")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get('[aria-label="selected team"]')
        .contains("Starting XI")
        .parentsUntil("section")
        .parent()
        .find('[role="listitem"]')
        .parent()
        .contains("Fernandes")
        .should("not.exist");
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to previous gameweek"]')
        .click();
      cy.get('[aria-label="selected team"]')
        .contains("Starting XI")
        .parentsUntil("section")
        .parent()
        .find('[role="listitem"]')
        .parent()
        .should("exist");

      // Free hits added up to 2
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="team planner toolbar"]')
        .find("section")
        .contains("Free")
        .next()
        .should((p) => (+p.text().match(/(\d+)/)?.[1] ?? 100) === 2);

      // TODO: player fixtures should reflect
    });

    it("supports chips.", () => {
      // Disabled already used chips from FPL
      cy.get('[aria-label="team planner toolbar"]')
        .find('[aria-label="select a chip"] [value="bboost"]')
        .should("be.disabled");

      // Disabled already used chips from local
      cy.get('[aria-label="team planner toolbar"]')
        .find('[aria-label="select a chip"]')
        .select("3xc");
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="team planner toolbar"]')
        .find('[aria-label="select a chip"] [value="3xc"]')
        .should("be.disabled");

      // freehit reverts team back and gw's free transfer after freehit/wildcard is 1
      cy.get('[aria-label="team planner toolbar"]')
        .find('[aria-label="select a chip"]')
        .select("freehit");
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Greenwood")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer"]')
        .click();
      cy.get('[aria-label="transfer market"]')
        .find('table tbody tr th:nth-child(1) [aria-label="transfer player"]')
        .first()
        .click({ force: true });
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Shaw")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer"]')
        .click();
      cy.get('[aria-label="transfer market"]')
        .find('table tbody tr th:nth-child(1) [aria-label="transfer player"]')
        .first()
        .click({ force: true });
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Toney")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer"]')
        .click();
      cy.get('[aria-label="transfer market"]')
        .find('table tbody tr th:nth-child(1) [aria-label="transfer player"]')
        .first()
        .click({ force: true });
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Greenwood")
        .should("exist");
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Shaw")
        .should("exist");
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Toney")
        .should("exist");
      cy.get('[aria-label="team planner toolbar"]')
        .find("section")
        .contains("Free")
        .next()
        .should((p) => (+p.text().match(/(\d+)/)?.[1] ?? 100) === 1);
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to previous gameweek"]')
        .click();
      cy.get('[aria-label="team planner toolbar"]')
        .find('[aria-label="select a chip"]')
        .select("wildcard");
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="team planner toolbar"]')
        .find("section")
        .contains("Free")
        .next()
        .should((p) => (+p.text().match(/(\d+)/)?.[1] ?? 100) === 1);
    });

    it("supports captains.", () => {
      // Only max one captain and vice captain at a time
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="set as captain"]')
        .first()
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="captain"]')
        .should("have.length", 1);
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="set as vice captain"]')
        .first()
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="vice captain"]')
        .should("have.length", 1);
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="set as captain"]')
        .eq(2)
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="captain"]')
        .should("have.length", 1);
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="set as captain"]')
        .eq(3)
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="captain"]')
        .should("have.length", 1);

      // Linger to next week
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Greenwood")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="set as captain"]')
        .click();
      cy.get('[aria-label="gameweek navigator"]')
        .find('[aria-label="go to next gameweek"]')
        .click();
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Greenwood")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="captain"]')
        .should("exist");
    });

    it("shows players exceed warning.", () => {
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="player name"]')
        .contains("Sánchez")
        .first()
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="transfer"]')
        .click();
      cy.get('[aria-label="transfer market"]')
        .find('[aria-label="search for players"]')
        .clear()
        .type('name:"de Gea"')
        .wait(300);
      cy.get('[aria-label="transfer market"]')
        .find('table tbody tr th:nth-child(1) [aria-label="transfer player"]')
        .first()
        .click();
      cy.get("main")
        .contains(
          "You cannot select more than 3 players from a same team (MUN)"
        )
        .should("be.visible");
    });

    it("supports pinned bench.", () => {
      cy.get('[aria-label="selected team"]')
        .find('[aria-label="pin bench"]')
        .click();
      cy.get('[role="tabpanel"]')
        .find('[aria-label="selected team"]')
        .contains("Bench")
        .parentsUntil("section")
        .parent()
        .parent()
        .should("have.css", "position", "sticky");
    });
  });
});
