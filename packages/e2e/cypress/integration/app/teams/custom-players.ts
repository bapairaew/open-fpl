describe("Teams Planner", () => {
  describe("Custom players", () => {
    describe("From scratch", () => {
      beforeEach(() => {
        cy.intercept("/_next/data/**/teams/4073.json", {
          fixture: "teams/4073.json",
        });
        cy.visit("/teams");
        cy.setUpProfile();
        cy.visit("/teams/4073");
      });

      it("manages custom players.", () => {
        cy.get('[aria-label="team plans"]')
          .find("button")
          .contains("Custom Players")
          .first()
          .click();

        cy.get("#add-custom-player").find('[name="name"]').type("Messi");
        cy.get("#add-custom-player").find('[name="cost"]').type("15.3");
        cy.get("#add-custom-player").find('[name="position"]').select("MID");
        cy.get("#add-custom-player").find('[name="team"]').select("TOT");
        cy.get("#add-custom-player").find('[type="submit"]').click();

        // Add one
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Messi")
          .should("be.visible")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('[aria-label="player cost"]')
          .should("have.text", "£15.3")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('[aria-label="player position"]')
          .should("have.text", "MID")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('[aria-label="player team"]')
          .should("have.text", "TOT");

        cy.get('[role="dialog"]')
          .find("button")
          .contains("Add a new custom player")
          .click();

        // Add another
        cy.get("#add-custom-player").find('[name="name"]').type("Rooney");
        cy.get("#add-custom-player").find('[name="cost"]').type("10");
        cy.get("#add-custom-player").find('[name="position"]').select("FWD");
        cy.get("#add-custom-player").find('[name="team"]').select("MUN");
        cy.get("#add-custom-player").find('[type="submit"]').click();
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Rooney")
          .should("be.visible")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('[aria-label="player cost"]')
          .should("have.text", "£10.0")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('[aria-label="player position"]')
          .should("have.text", "FWD")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('[aria-label="player team"]')
          .should("have.text", "MUN");

        // Edit one
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Messi")
          .should("be.visible")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find("button")
          .contains("Edit")
          .click()
          .parentsUntil('[role="listitem"]')
          .get("form")
          .find('[name="name"]')
          .clear()
          .type("L. Messi{enter}");
        cy.get('[aria-label="custom players list"]')
          .find('[aria-label="player name"]')
          .contains("L. Messi")
          .should("exist");

        // Edit another
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Rooney")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find("button")
          .contains("Edit")
          .click()
          .parentsUntil('[role="listitem"]')
          .get("form")
          .find('[name="cost"]')
          .clear()
          .type("9{enter}");
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Rooney")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('[aria-label="player cost"]')
          .should("have.text", "£9.0");

        // Delete one
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Rooney")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find("button")
          .contains("Remove")
          .click();
        cy.get('[role="alertdialog"]')
          .find("button")
          .contains("Remove")
          .click();
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Rooney")
          .should("not.exist");

        // Delete all
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("L. Messi")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find("button")
          .contains("Remove")
          .click();
        cy.get('[role="alertdialog"]')
          .find("button")
          .contains("Remove")
          .click();
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .should("not.exist");
      });
    });

    describe("From pre-setup", () => {
      beforeEach(() => {
        cy.intercept("/_next/data/**/teams/4073.json", {
          fixture: "teams/4073.json",
        });
        cy.visit("/teams");
        cy.setUpProfile("profiles/with-custom-players.json");
        cy.visit("/teams/4073");
      });

      it("is shown on transfer market.", () => {
        cy.get('[aria-label="selected team"]')
          .find('[aria-label="player position"]')
          .contains("MID")
          .first()
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('[aria-label="transfer"]')
          .click();

        cy.get('[aria-label="transfer market"]')
          .find('[aria-label="search for players"]')
          .clear()
          .type("name:Kaka")
          .wait(300);

        cy.get('[aria-label="transfer market"]')
          .find("tbody tr th")
          .contains("Kaka")
          .should("exist");
      });

      it("updates plans.", () => {
        cy.get('[aria-label="team plans"]')
          .find("button")
          .contains("Custom Players")
          .first()
          .click();
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Kaka")
          .should("be.visible")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find("button")
          .contains("Edit")
          .click()
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('form [name="name"]')
          .clear()
          .type("R. Kaka")
          .parentsUntil("form")
          .parent()
          .find('[type="submit"]')
          .click();

        cy.get('[aria-label="selected team"]')
          .find('[aria-label="player name"]')
          .contains("R. Kaka")
          .should("exist");
      });

      it("is auto-removed if position/team is updated.", () => {
        cy.get('[aria-label="team plans"]')
          .find("button")
          .contains("Custom Players")
          .first()
          .click();
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"]')
          .contains("Kaka")
          .should("be.visible")
          .parentsUntil('[role="listitem"]')
          .parent()
          .find("button")
          .contains("Edit")
          .click()
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('form [name="team"]')
          .select("MCI")
          .parentsUntil("form")
          .parent()
          .find('[type="submit"]')
          .click();
        cy.get('[role="alertdialog"]')
          .find("button")
          .contains("Cancel")
          .click();
        cy.get('[aria-label="custom players list"]')
          .find('[role="listitem"] form [name="name"][value="Kaka"]')
          .parentsUntil('[role="listitem"]')
          .parent()
          .find('form [name="team"]')
          .select("CHE")
          .parentsUntil("form")
          .parent()
          .find('[name="position"]')
          .select("FWD")
          .parentsUntil("form")
          .parent()
          .find('[type="submit"]')
          .click();
        cy.get('[role="alertdialog"]')
          .find("button")
          .contains("Continue")
          .click();
        cy.get('[aria-label="selected team"]')
          .find('[aria-label="player name"]')
          .contains("Kaka")
          .should("not.exist");
      });
    });
  });
});
