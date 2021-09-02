describe("Redirection", () => {
  it("redirects /players urls to new app domain.", () => {
    cy.request({
      url: "/players",
      followRedirect: false,
    }).then((response) => {
      expect(response.redirectedToUrl).to.match(
        /^https:\/\/app.openfpl.com\/players\/?$/
      );
    });
  });

  it("redirects /teams urls to new app domain.", () => {
    cy.request({
      url: "/teams",
      followRedirect: false,
    }).then((response) => {
      expect(response.redirectedToUrl).to.match(
        /^https:\/\/app.openfpl.com\/teams\/?$/
      );
    });
  });

  it("redirects /help urls to new app domain.", () => {
    cy.request({
      url: "/help/players",
      followRedirect: false,
    }).then((response) => {
      expect(response.redirectedToUrl).to.match(
        /^https:\/\/app.openfpl.com\/help\/players\/?$/
      );
    });
  });
});
