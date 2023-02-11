import {
  getAlertFailedLogin,
  getToastify,
  performLogin,
} from "../support/login";

describe("login", function () {
  it("allow login account manager success", function () {
    performLogin("quanmanager", "123456");
    getToastify(true);
    cy.url().should("contain", "/");
  });

  it("allow login account employee success", function () {
    performLogin("quanemployee", "123456");
    getToastify(true);
    cy.url().should("contain", "/");
  });

  it("allow login account admin success", function () {
    performLogin("quanadmin", "123456");
    getToastify(true);
    cy.url().should("contain", "/");
  });

  it("not allow login account admin success", function () {
    performLogin("noaccount", "123456");
    getAlertFailedLogin();
    getToastify(false);
  });
});
