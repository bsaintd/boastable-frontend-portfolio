
describe("login", ()=>{
  beforeEach(()=>{
    cy.visit("http://localhost:8080/login");
  });
  it("should open the site",() => {
    cy.get("[name='login']").type("ryan@fueledonbacon.com");
    cy.get("[name='password']").type("123qweQWE");
    cy.get("button.login-button").click();
    expect(cy.contains('Dashboard')).toBeTruthy
  })
});