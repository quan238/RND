describe("Create Employee", () => {
  beforeEach(() => {
    cy.login("quanadmin", "123456");
  });

  it("creates an employee", () => {
    cy.viewport(1920, 961);

    cy.visit("http://103.82.20.238:3000/employee-add");

    cy.get(
      ".border-radius-default > .flex-column > .MuiFormControl-root > .MuiInputBase-root > #mui-3"
    ).click();

    cy.get(
      ".border-radius-default > .flex-column > .MuiFormControl-root > .MuiInputBase-root > #mui-3"
    ).type("quantranemployee");

    cy.get(
      ".border-radius-default > .flex-column > .MuiFormControl-root > .MuiInputBase-root > #mui-4"
    ).type("123456");

    cy.get(".sidebar-mini").click();

    cy.get(
      ".sidebar-mini > #menu-departmentId > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(2)"
    ).click();

    cy.get(".sidebar-mini").click();

    cy.get(
      ".sidebar-mini > #menu-role > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(1)"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formFirstName"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formFirstName"
    ).type("Quan");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formLastName"
    ).type("Tran");

    cy.get(
      ".form-group > .form-row > .react-datepicker-wrapper > .react-datepicker__input-container > .w-100"
    ).click();

    cy.get(
      ".react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--023"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formGender"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formGender"
    ).select("Male");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formGender"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formMaritalStatus"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formMaritalStatus"
    ).select("Married");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formMaritalStatus"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formId"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formId"
    ).type("221488098");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formFatherName"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formFatherName"
    ).type("123");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formJobTitle"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formJobTitle"
    ).type("Fullstack Developer");

    cy.get(
      ".form-group > .form-row > .react-datepicker-wrapper > .react-datepicker__input-container > .react-datepicker-ignore-onclickoutside"
    ).click();

    cy.get(
      ".react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--009"
    ).click();

    cy.get(
      ".form-group > .form-row > .react-datepicker-wrapper > .react-datepicker__input-container > .react-datepicker-ignore-onclickoutside"
    ).click();

    cy.get(
      ".react-datepicker__tab-loop > .react-datepicker-popper > div > .react-datepicker > .react-datepicker__navigation--next"
    ).click();

    cy.get(
      ".react-datepicker__tab-loop > .react-datepicker-popper > div > .react-datepicker > .react-datepicker__navigation--next"
    ).click();

    cy.get(
      ".react-datepicker__tab-loop > .react-datepicker-popper > div > .react-datepicker > .react-datepicker__navigation--next"
    ).click();

    cy.get(
      ".react-datepicker > .react-datepicker__month-container > .react-datepicker__month > .react-datepicker__week > .react-datepicker__day--018"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formPhysicalAddress"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formPhysicalAddress"
    ).type("109/44/2B Dương Bá Trạc Quận 8");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formFirstName"
    ).type("Trần");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formLastName"
    ).type("Quân");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formCountry"
    ).type("Vietnam");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formCity"
    ).type("Phường 01");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formMobile"
    ).type("0798988238");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formEmail"
    ).type("quantran2381@gmail.com");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formPhone"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formPhone"
    ).type("0798988238");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formBankName"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formBankName"
    ).type("123");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formAccountName"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formAccountName"
    ).type("1234567");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formAccountNumber"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formAccountNumber"
    ).type("1234567");

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formIban"
    ).click();

    cy.get(
      ".px-3 > .MuiGrid-root > .MuiGrid-root > .form-group > #formIban"
    ).type("1234567");

    cy.get(
      ".MuiGrid-root > .MuiGrid-root > .border-radius-default > .MuiCardActions-root > .MuiButtonBase-root"
    ).click();
  });
});
