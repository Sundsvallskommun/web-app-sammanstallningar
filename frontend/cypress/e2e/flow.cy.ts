import { meUser } from '../fixtures/me-user';
import { flows, flow } from '../fixtures/flows';
import {
  deleteSessionResponse,
  inputValue,
  sessionWithoutOutput,
  sessionWithOutput,
  stepExecution1,
  stepExecution2,
  stepExecution3,
} from '../fixtures/session';

describe('Can use AI-sammanställningar', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', meUser);
    cy.intercept('GET', '**/api/flow', flows);
    cy.intercept('GET', '**/api/**/flow/flow1/1', flow);
    cy.intercept('POST', '**/api/session', sessionWithoutOutput);
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', sessionWithoutOutput).as(
      'sessionWithoutOutput'
    );
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', sessionWithOutput).as(
      'sessionWithOutput'
    );
    cy.intercept('POST', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', sessionWithoutOutput);
    cy.intercept('POST', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/input/**/**', inputValue);
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step1', stepExecution1);
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step2', stepExecution2);
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step3', stepExecution3);
    cy.intercept('DELETE', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', deleteSessionResponse);

    cy.intercept('POST', '**/api/session/**/generate', {
      statusCode: 200,
      body: {
        data: {
          data: 'SGVsbG8gd29ybGQ=',
          mimeType: 'application/pdf',
        },
      },
    }).as('generateDocument');

    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000/');

    cy.get('.sk-cookie-consent-btn-wrapper').contains('Godkänn alla').click();
  });

  it('Can generate document of flow type', () => {
    // Pick flow
    cy.get('[data-cy="flow-card-0"]').contains('Flow 1').click();

    // Try to surpass input step
    cy.get('[data-cy="generate"]').click();
    cy.get('p').contains('Fyll i efterfrågad information').should('exist');

    // Add information
    flow.data.input.map((input) => {
      if (input.type === 'TEXT' || input.type === 'STRING') {
        cy.get(`[data-cy="${input.id}"]`).type('Mock text');
      } else {
        cy.get(`[data-cy="${input.id}"]`).within(() => {
          cy.get('.sk-link').contains('Välj fil').click();
          cy.get('input[type=file]').selectFile('cypress/files/attachment.txt', { force: true });
        });
      }
    });

    cy.get('p').contains('Detta fält måste fyllas i').should('not.exist');

    // Generate steps
    cy.get('[data-cy="generate"]').click();
    cy.get('[data-cy="save-document"]').should('be.disabled');
    cy.wait('@sessionWithOutput');

    // Can step back to form and change input
    cy.get('[data-cy="go-back-button"]').should('exist').click();
    for (const input of flow.data.input) {
      if (input.type === 'TEXT' || input.type === 'STRING') {
        cy.get(`[data-cy="${input.id}"]`).clear().type('New mock text');
      }
    }

    cy.get('[data-cy="generate"]').click();
    cy.get('.sk-dialog .sk-btn-primary').should('have.text', 'Ja, generera om').click();

    cy.get('[data-cy="save-document"]').should('be.disabled');
    cy.wait('@sessionWithOutput');

    cy.get('[data-cy="save-document"]').should('not.be.disabled').click();

    // Save document
    cy.get('[data-cy="download-document-button"]').should('be.disabled');
    cy.get('[data-cy="attest-checkbox"]').should('exist').check({ force: true });
    cy.wait('@generateDocument');
    cy.get('[data-cy="download-document-button"]').should('not.be.disabled');
    cy.get('[data-cy="download-document-button"]').contains('Ladda ner Flow 1');
    cy.get('[data-cy="generate-new"]').should('exist').click();
    cy.get('[data-cy="flow-card-0"]').contains('Flow 1').should('exist');
  });
});
