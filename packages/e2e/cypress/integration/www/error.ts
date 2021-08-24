describe("Error", () => {
  it("shows 404 error message and link to home page.", () => {
    cy.visit("/this-path-does-not-exist", { failOnStatusCode: false });
    cy.contains("This page no longer exists or has never been here.").should(
      "be.visible"
    );
    cy.get('a[href="/"]').should("be.visible");
  });
});
