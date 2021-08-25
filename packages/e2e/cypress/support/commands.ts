export {};

declare global {
  namespace Cypress {
    interface Chainable {
      setUpProfile: () => void;
    }
  }
}

Cypress.Commands.add("setUpProfile", () => {
  cy.fixture("profiles/main.json").then((json) => {
    for (const key of Object.keys(json)) {
      window.localStorage.setItem(key, JSON.stringify(json[key]));
    }
  });
  cy.get("body").contains("Test account");
});
