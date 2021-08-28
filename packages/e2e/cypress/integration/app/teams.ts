describe("Teams Planner", { retries: 0 }, () => {
  describe.skip("Empty profile", () => {
    beforeEach(() => {
      cy.visit("/teams");
    });

    it("asks users to set up a profile.", () => {
      cy.get("main")
        .find("button")
        .contains("Set up your profile")
        .should("be.visible");
    });

    it("redirects to the team specific page once profile set up.", () => {
      cy.get("aside").contains("Set up your profile").click();
      cy.get("#profile").type("4073{enter}");
      cy.get('[aria-label="select a profile"]')
        .contains("Team ID: 4073")
        .should("be.visible");
      cy.get('[role="dialog"]')
        .find("header")
        .contains("Profiles")
        .parent()
        .find('> [aria-label="Close"]')
        .click();
      cy.url().should("include", "/teams/4073");
    });
  });

  describe("Planner", () => {
    beforeEach(() => {
      cy.visit("/teams");
      cy.setUpProfile();
      cy.visit("/teams/4073");
    });

    it("subtitutes players.", () => {
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
        .as("bench");

      cy.get("@startingXI")
        .find('[aria-label="player position"]')
        .then((e) => {
          const elements = e.map((i, e) => e.textContent).toArray();
          const gkp = elements.filter((e) => e === "GKP").length;
          const def = elements.filter((e) => e === "DEF").length;
          const mid = elements.filter((e) => e === "MID").length;
          const fwd = elements.filter((e) => e === "FWD").length;
          expect(gkp).to.be.eq(1);
          expect(def).to.be.gte(3).and.to.be.lte(5);
          expect(mid).to.be.gte(2).and.to.be.lte(5);
          expect(fwd).to.be.gte(1).and.to.be.lte(3);

          cy.get("@startingXI")
            .find('[aria-label="player position"]')
            .contains("GKP")
            .first()
            .parentsUntil('[role="listitem"]')
            .parent()
            .find('[aria-label="substitute"]')
            .first()
            .click();
          if (def < 5)
            cy.get("@bench")
              .find('[aria-label="player position"]')
              .contains("DEF")
              .parentsUntil('[role="listitem"]')
              .parent()
              .find('button[aria-label="substitute"]')
              .should("have.attr", "disabled");
          if (mid < 5)
            cy.get("@bench")
              .find('[aria-label="player position"]')
              .contains("MID")
              .parentsUntil('[role="listitem"]')
              .parent()
              .find('button[aria-label="substitute"]')
              .should("have.attr", "disabled");
          if (fwd < 3)
            cy.get("@bench")
              .find('[aria-label="player position"]')
              .contains("FWD")
              .parentsUntil('[role="listitem"]')
              .parent()
              .find('button[aria-label="substitute"]')
              .should("have.attr", "disabled");
          cy.get("@bench")
            .find('[aria-label="player position"]')
            .contains("GKP")
            .parentsUntil('[role="listitem"]')
            .parent()
            .find('button[aria-label="substitute"]')
            .should("not.have.attr", "disabled")
            .click();

          cy.get("@startingXI")
            .find('[aria-label="player position"]')
            .contains("DEF")
            .first()
            .parentsUntil('[role="listitem"]')
            .parent()
            .find('[aria-label="substitute"]')
            .first()
            .click();
          cy.get("@bench")
            .find('[aria-label="player position"]')
            .contains("GKP")
            .parentsUntil('[role="listitem"]')
            .parent()
            .find('button[aria-label="substitute"]')
            .should("have.attr", "disabled");
          if (mid < 5)
            cy.get("@bench")
              .find('[aria-label="player position"]')
              .contains("MID")
              .parentsUntil('[role="listitem"]')
              .parent()
              .find('button[aria-label="substitute"]')
              .should(def >= 3 ? "have.attr" : "not.have.attr", "disabled");
          if (fwd < 3)
            cy.get("@bench")
              .find('[aria-label="player position"]')
              .contains("FWD")
              .parentsUntil('[role="listitem"]')
              .parent()
              .find('button[aria-label="substitute"]')
              .should(def >= 3 ? "have.attr" : "not.have.attr", "disabled");
          if (def < 5)
            cy.get("@bench")
              .find('[aria-label="player position"]')
              .contains("DEF")
              .parentsUntil('[role="listitem"]')
              .parent()
              .find('button[aria-label="substitute"]')
              .should("not.have.attr", "disabled")
              .click();
        });
    });

    it("transfers players.");

    it("supports future gameweeks.");

    it("supports chips.");

    it("supports captains.");

    it("shows players exceed warning.");

    it("supports pinned bench.");
  });

  describe("Changelog", () => {
    it("jumps to a specific gameweek.");
    it("shows invalid changes warning.");
    it("supports summary modal.");
  });

  describe("Transfer Market", () => {
    it("sorts players");
    it("filters players");
  });

  describe("Custom Players", () => {
    it("manages custom players.");

    it(
      "removes custom players from plans when position edited or players removed."
    );
  });

  describe("Multiple plans", () => {
    it("manages team plans");

    describe("Mobile", () => {
      it("manages team plans");
    });
  });
});
