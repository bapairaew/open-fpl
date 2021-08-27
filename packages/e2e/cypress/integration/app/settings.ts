describe("Settings", { retries: 0 }, () => {
  describe.skip("Profile", () => {
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

  describe("Migration", () => {
    it("migrates v1.0 to v1.1.", () => {
      // inject NEXT_PUBLIC_CROSS_DOMAIN_HUB_URL
      // intercept NEXT_PUBLIC_CROSS_DOMAIN_HUB_URL
      // ???
    });
  });
});
