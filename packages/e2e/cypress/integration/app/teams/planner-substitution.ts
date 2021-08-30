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

    it("substitutes players.", () => {
      cy.get('[role="tabpanel"]')
        .find('[aria-label="selected team"]')
        .contains("Starting XI")
        .parentsUntil("section")
        .parent()
        .find('[role="listitem"]')
        .as("startingXI");

      cy.get('[role="tabpanel"]')
        .find('[aria-label="selected team"]')
        .contains("Bench")
        .parentsUntil("section")
        .parent()
        .find('[role="listitem"]')
        .parent()
        .as("bench");

      cy.get("@startingXI")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[aria-label="starting GKP"]')
        .parent()
        .as("startingGKP");
      cy.get("@startingXI")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .parentsUntil('[aria-label="starting DEF"]')
        .parent()
        .as("startingDEF");
      cy.get("@startingXI")
        .find('[aria-label="player position"]')
        .contains("MID")
        .parentsUntil('[aria-label="starting MID"]')
        .parent()
        .as("startingMID");
      cy.get("@startingXI")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[aria-label="starting FWD"]')
        .parent()
        .as("startingFWD");

      cy.get("@startingGKP")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingGKP")
        .first()
        .find('[aria-label="player name"]')
        .contains("Begović")
        .should("exist");

      // DEF to MID -> 3-5-2
      cy.get("@startingDEF")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("not.be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("not.be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingMID")
        .first()
        .find('[aria-label="player name"]')
        .contains("Brownhill")
        .should("exist");

      // DEF to DEF -> FWD, MID disallowed
      cy.get("@startingDEF")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .should("not.exist");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingDEF")
        .first()
        .find('[aria-label="player name"]')
        .contains("Alexander-Arnold")
        .should("exist");

      // FWD to DEF -> 4-5-1
      cy.get("@startingFWD")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .should("not.exist");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("not.be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingDEF")
        .first()
        .find('[aria-label="player name"]')
        .contains("Amartey")
        .should("exist");

      // FWD to FWD -> MID, DEF disallowed
      cy.get("@startingFWD")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .should("not.exist");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingFWD")
        .first()
        .find('[aria-label="player name"]')
        .contains("Ings")
        .should("exist");

      // MID to DEF -> 5-4-1
      cy.get("@startingMID")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .should("not.exist");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("not.be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingDEF")
        .first()
        .find('[aria-label="player name"]')
        .contains("White")
        .should("exist");

      // MID TO FWD -> 5-3-2
      cy.get("@startingMID")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .should("not.exist");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("not.be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingFWD")
        .first()
        .find('[aria-label="player name"]')
        .contains("Toney")
        .should("exist");

      // MID TO FWD -> 5-2-3
      cy.get("@startingMID")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .should("not.exist");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("not.be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingFWD")
        .first()
        .find('[aria-label="player name"]')
        .contains("Antonio")
        .should("exist");

      // MID TO MID -> FWD, DEF disallowed
      cy.get("@startingMID")
        .first()
        .find('[aria-label="substitute"]')
        .first()
        .click();
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("GKP")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .should("be.disabled");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("DEF")
        .should("not.exist");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("FWD")
        .should("not.exist");
      cy.get("@bench")
        .find('[aria-label="player position"]')
        .contains("MID")
        .parentsUntil('[role="listitem"]')
        .parent()
        .find('[aria-label="substitute"]')
        .first()
        .click({ force: true });
      cy.get("@startingMID")
        .first()
        .find('[aria-label="player name"]')
        .contains("Greenwood")
        .should("exist");
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
  });
});
