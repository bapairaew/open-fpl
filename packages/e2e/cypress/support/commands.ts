export {};

declare global {
  namespace Cypress {
    interface Chainable {
      setUpProfile: (fixture?: string) => void;
      waitForPageReload: () => void;
    }
  }
}

Cypress.Commands.add(
  "setUpProfile",
  function setUpProfile(fixture = "profiles/main.json") {
    cy.fixture(fixture).then((json) => {
      for (const key of Object.keys(json)) {
        window.localStorage.setItem(key, JSON.stringify(json[key]));
      }
    });
  }
);

// https://github.com/cypress-io/cypress/issues/1805#issuecomment-714721837
Cypress.Commands.add("waitForPageReload", function waitForPageReload() {
  cy.window().then((win) => {
    // @ts-ignore
    win.beforeReload = true;
  });
  cy.window().should("have.prop", "beforeReload", true);
  cy.window().should("not.have.prop", "beforeReload");
});
