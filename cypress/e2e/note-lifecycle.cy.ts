describe('Note lifecycle', () => {
  it('logs in, creates a note, and deletes it', () => {
    const email = Cypress.env('TEST_USER_EMAIL') as string | undefined;
    const password = Cypress.env('TEST_USER_PASSWORD') as string | undefined;

    if (!email || !password) {
      throw new Error('Set CYPRESS_TEST_USER_EMAIL and CYPRESS_TEST_USER_PASSWORD before running this test.');
    }

    const title = `E2E note ${Date.now()}`;

    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get('[data-testid="login-button"]').should('be.enabled');
    cy.get('[data-testid="email-input"]').should('be.enabled').type(email);
    cy.get('[data-testid="password-input"]').type(password, { log: false });
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="logout-button"]').should('be.visible');

    cy.get('[data-testid="new-note-button"]').click();
    cy.get('[data-testid="note-title-input"]').type(title).type('{enter}');
    cy.get('[data-testid="note-content-input"]').type('Created by an end-to-end test.');
    cy.get('[data-testid="save-note-button"]').click();

    cy.contains('[data-testid="note-card"]', title).should('be.visible');
    cy.contains('[data-testid="note-card"]', title).within(() => {
      cy.get('[data-testid="delete-note-button"]').click();
      cy.get('[data-testid="confirm-delete-note-button"]').should('be.visible');
      cy.get('[data-testid="confirm-delete-note-button"]').click();
    });

    cy.contains('[data-testid="note-card"]', title).should('not.exist');
  });
});


