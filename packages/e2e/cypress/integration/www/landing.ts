describe("Landing page", () => {
  describe("Main features", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("has CTA button linked to app.", () => {
      cy.get("a")
        .contains(/Start using/i)
        .should("have.attr", "href", "https://app.openfpl.com");
    });

    it("shows features and linked to corresponding app pages.", () => {
      cy.contains(/\"Live\" Dashboard/i)
        .parent()
        .find("a")
        .should("have.attr", "href", "https://app.openfpl.com/");

      cy.contains(/Players Statistics Explorer/i)
        .parent()
        .find("a")
        .should("have.attr", "href", "https://app.openfpl.com/players");

      cy.contains(/Team Planner/i)
        .parent()
        .find("a")
        .should("have.attr", "href", "https://app.openfpl.com/teams");

      cy.contains(/Fixture Difficulty Rating/i)
        .parent()
        .find("a")
        .should("have.attr", "href", "https://app.openfpl.com/fixtures");
    });

    it("shows links to GitHub and Twitter.", () => {
      cy.get("a")
        .contains(/GitHub/i)
        .should("have.attr", "href", "https://github.com/bapairaew/open-fpl");

      cy.get("a")
        .contains(/Twitter/i)
        .should("have.attr", "href", "https://twitter.com/openfpl");
    });
  });

  describe("Redirection", () => {
    it("redirects /players urls to new app domain.", () => {
      cy.visit("/players");
      cy.url().should("eq", "https://app.openfpl.com/players");
    });

    it("redirects /teams urls to new app domain.", () => {
      cy.visit("/teams");
      cy.url().should("eq", "https://app.openfpl.com/teams");
    });

    it("redirects /teams urls to new app domain.", () => {
      cy.visit("/help/players");
      cy.url().should("eq", "https://app.openfpl.com/help/players");
    });
  });

  describe("404", () => {
    it("shows error message and link to home page.", () => {
      cy.visit("/this-path-does-not-exist", { failOnStatusCode: false });
      cy.contains("This page no longer exists or has never been here.").should(
        "be.visible"
      );
      cy.get('a[href="/"]').should("be.visible");
    });
  });
});
