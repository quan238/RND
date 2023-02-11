exports.performLogin = (username, password) => {
  cy.viewport(1920, 961);

  cy.visit("http://103.82.20.238:3000/login");

  cy.get(
    "div > .input-group > .MuiFormControl-root > .MuiInputBase-root > #mui-1"
  ).click();

  cy.get(
    "div > .input-group > .MuiFormControl-root > .MuiInputBase-root > #mui-1"
  ).type(username);

  cy.get(
    "div > .input-group > .MuiFormControl-root > .MuiInputBase-root > #password"
  ).click();

  cy.get(
    "div > .input-group > .MuiFormControl-root > .MuiInputBase-root > #password"
  ).type(password);

  cy.get(".card > .card-body > form > .row > .MuiButtonBase-root").click();
};

exports.getAlertFailedLogin = (message) => {
  cy.get(".MuiAlert-message")
    .should("have.text", "Incorrect Credentials!")
    .and("be.visible");
};

exports.getToastify = (loginSuccess) => {
  cy.get(".Toastify__toast-body").should(
    "contain",
    !loginSuccess ? "Login Failed" : "Login Successfully"
  );
};
