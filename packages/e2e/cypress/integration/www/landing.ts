describe("Landing page", () => {
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
