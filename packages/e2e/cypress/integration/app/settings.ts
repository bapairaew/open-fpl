describe("Settings", () => {
  describe("Profile", () => {
    beforeEach(() => {
      cy.visit("/help/dashboard"); // Fastest page to load
      cy.get("aside").contains("Set up your profile").click();
    });

    it("manages profile.", () => {
      // Able to add a profile
      cy.get("#profile").type("4073{enter}");
      cy.get('[aria-label="select a profile"]')
        .contains("Team ID: 4073")
        .should("be.visible");
      cy.get('[aria-label="select a profile"]')
        .find('input[type="radio"][value="4073"]')
        .should("be.checked");
      cy.get('[aria-label="open profiles settings"]').should((button) =>
        expect(Cypress.$("#profile-4073").text().trim()).to.be.eq(
          button.text().trim()
        )
      );

      // Able to add a another profile
      cy.get('[role="dialog"]').contains("Add a new profile").click();
      cy.get("#profile").type("543210{enter}");
      cy.get('[aria-label="select a profile"]')
        .contains("Team ID: 543210")
        .should("be.visible");
      cy.get('[aria-label="select a profile"]')
        .find('input[type="radio"][value="543210"]')
        .should("be.checked");
      cy.get('[aria-label="open profiles settings"]').should((button) =>
        expect(Cypress.$("#profile-543210").text().trim()).to.be.eq(
          button.text().trim()
        )
      );

      // Able to switch profile
      cy.get('[aria-label="select a profile"]')
        .find('input[type="radio"][value="4073"]')
        .check({ force: true });
      cy.get('[aria-label="select a profile"]')
        .find('input[type="radio"][value="4073"]')
        .should("be.checked");
      cy.get('[aria-label="open profiles settings"]').should((button) =>
        expect(Cypress.$("#profile-4073").text().trim()).to.be.eq(
          button.text().trim()
        )
      );

      // Able to remove a profile
      cy.get('[aria-label="select a profile"]')
        .find('input[type="radio"][value="4073"]')
        .parent()
        .find('[aria-label="remove"]')
        .click();
      cy.get('[role="alertdialog"]')
        .contains("Remove Profile")
        .should("be.visible")
        .parent()
        .find("button")
        .contains("Remove")
        .click();
      cy.get('[role="dialog"]')
        .find('input[type="radio"]:checked')
        .should("not.exist");
      cy.get("aside").contains("Set up your profile").should("exist");

      // Able to remove all profiles
      cy.get('[aria-label="select a profile"]')
        .find('input[type="radio"][value="543210"]')
        .parent()
        .find('[aria-label="remove"]')
        .click();
      cy.get('[role="alertdialog"]')
        .contains("Remove Profile")
        .should("be.visible")
        .parent()
        .find("button")
        .contains("Remove")
        .click();
      cy.get('[aria-label="select a profile"]')
        .children()
        .should("have.length", 0);
    });

    it("disallows invalid profiles", () => {
      // Add empty profile id, should have no profile added
      cy.get("#profile").type("test{enter}");
      cy.get('[aria-label="select a profile"]')
        .children()
        .should("have.length", 0);

      // Add non-existence profile id, should show error and no profile added
      cy.get("#profile").type("888888888{enter}");
      cy.get("body")
        .contains("Check this guide to find your ID.")
        .should("be.visible");
      cy.get('[aria-label="select a profile"]')
        .children()
        .should("have.length", 0);
    });

    it("remembers profiles.", () => {
      cy.get("#profile").type("4073{enter}");
      cy.get('[aria-label="select a profile"]')
        .contains("Team ID: 4073")
        .should("be.visible");

      cy.get('[role="dialog"]').contains("Add a new profile").click();
      cy.get("#profile").type("543210{enter}");
      cy.get('[aria-label="select a profile"]')
        .contains("Team ID: 543210")
        .should("be.visible");

      cy.reload();
      cy.get("aside").find('[aria-label="open profiles settings"]').click();
      cy.get('[aria-label="select a profile"]')
        .contains("Team ID: 4073")
        .should("be.visible");
      cy.get('[aria-label="select a profile"]')
        .find('input[type="radio"][value="543210"]')
        .should("be.checked");
      cy.get('[aria-label="open profiles settings"]').should((button) =>
        expect(Cypress.$("#profile-543210").text().trim()).to.be.eq(
          button.text().trim()
        )
      );
    });
  });

  // TODO: this always fails on Github Actions, but not locally
  describe.skip("Migration", () => {
    it("migrates www domain to app domain.", () => {
      cy.intercept("**/cross-storage-hub.html", {
        fixture: "migration/www-to-app-domain/cross-storage-hub.html",
      });

      cy.visit("/players");
      cy.waitForPageReload();

      // Profile
      cy.get("aside").contains("Test Account").should("be.visible").click();
      cy.get('[aria-label="select a profile"]')
        .contains("Test Account")
        .should("be.visible");
      cy.get('[aria-label="select a profile"]')
        .contains("Another Test Account")
        .should("be.visible");
      cy.get('[role="dialog"]')
        .find("header")
        .contains("Profiles")
        .parent()
        .find('> [aria-label="Close"]')
        .click();

      // Display option
      cy.get('main select[aria-label="select display options"]').should(
        "have.value",
        "grid"
      );

      // Sort option
      cy.get("main")
        .find('select[aria-label="sort players"]')
        .should("have.value", "cost-asc");

      // Table sort option
      cy.get("main")
        .find('select[aria-label="select display options"]')
        .select("table");
      cy.get('[aria-label="players table"]')
        .find("th")
        .contains("Pos")
        .parent()
        .find('[aria-label="descending"]')
        .should("exist");
      cy.get('[aria-label="players table"]')
        .find("th")
        .contains("Points")
        .parent()
        .find('[aria-label="descending"]')
        .should("exist");

      // Starred players
      cy.get("main")
        .find('[aria-label="remove star player"]')
        .children()
        .should("have.length", 2);

      cy.visit("/teams");

      // Team plans
      cy.get('main [role="tab"]').contains("Plan A").should("be.visible");
      cy.get('main [role="tab"]').contains("Plan B").should("be.visible");

      // Custom players
      cy.get("main").contains("Custom Players").click();
      cy.get('[role="dialog"]').contains("Ronaldo").should("be.visible");

      cy.get('[role="dialog"]')
        .find("header")
        .contains("Custom Players")
        .parent()
        .find('> [aria-label="Close"]')
        .click();

      cy.visit("/fixtures");

      // Team sort
      cy.get('[aria-label="fixtures table"]')
        .find("tbody tr th")
        .should((cells) => {
          expect(cells.map((i, c) => c.textContent).toArray()).to.deep.equal([
            "BHA",
            "LEE",
            "CHE",
            "LIV",
            "WHU",
            "ARS",
            "AVL",
            "LEI",
            "MCI",
            "MUN",
            "EVE",
            "WOL",
            "BUR",
            "CRY",
            "SOU",
            "WAT",
            "BRE",
            "NEW",
            "NOR",
            "TOT",
          ]);
        });

      // Team strength
      cy.get("main").find("button").contains("Edit Teams Strength").click();
      cy.get('[aria-label="home attack strength"]').should(
        "have.attr",
        "aria-valuenow",
        "1050"
      );
      cy.get('[aria-label="away attack strength"]').should(
        "have.attr",
        "aria-valuenow",
        "1050"
      );
    });
  });
});
