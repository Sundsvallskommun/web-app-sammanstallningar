import { meUser } from '../fixtures/me-user';
import { flows, flow } from '../fixtures/flows';
import {
  deleteSessionResponse,
  inputValue,
  sessionWithoutOutput,
  sessionWithOutput,
  sessionWithStaleDependenciesAfterStep1Rerun,
  sessionWithStaleDependencyAfterStep2Rerun,
  sessionWithoutStaleDependenciesAfterStep3Rerun,
  stepExecution1,
  stepExecution1Rerun,
  stepExecution2,
  stepExecution2Rerun,
  stepExecution3,
  stepExecution3Rerun,
} from '../fixtures/session';

describe('Can use AI-sammanställningar', () => {
  let currentSessionResponse = sessionWithoutOutput;
  let currentStepExecutions = {
    step1: stepExecution1,
    step2: stepExecution2,
    step3: stepExecution3,
  };

  beforeEach(() => {
    currentSessionResponse = sessionWithoutOutput;
    currentStepExecutions = {
      step1: stepExecution1,
      step2: stepExecution2,
      step3: stepExecution3,
    };

    cy.intercept('GET', '**/api/me', meUser);
    cy.intercept('GET', '**/api/flow', flows);
    cy.intercept('GET', '**/api/**/flow/flow1/1', flow);
    cy.intercept('POST', '**/api/session', sessionWithoutOutput);
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (req) => {
      req.reply(currentSessionResponse);
    }).as('sessionState');
    cy.intercept('POST', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', sessionWithoutOutput);
    cy.intercept('POST', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/input/**/**', inputValue);
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step1', (req) => {
      req.reply(currentStepExecutions.step1);
    });
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step2', (req) => {
      req.reply(currentStepExecutions.step2);
    });
    cy.intercept('GET', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step3', (req) => {
      req.reply(currentStepExecutions.step3);
    });
    cy.intercept('POST', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step1', (req) => {
      req.reply(currentStepExecutions.step1);
    }).as('rerunStep1');
    cy.intercept('POST', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step2', (req) => {
      req.reply(currentStepExecutions.step2);
    }).as('rerunStep2');
    cy.intercept('POST', '**/api/session/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/step/step3', (req) => {
      req.reply(currentStepExecutions.step3);
    }).as('rerunStep3');
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
    currentSessionResponse = sessionWithOutput;
    cy.get('[data-cy="generate"]').click();
    cy.get('[data-cy="save-document"]').should('be.disabled');
    cy.wait('@sessionState');

    // Can step back to form and change input
    cy.get('[data-cy="go-back-button"]').should('exist').click();
    for (const input of flow.data.input) {
      if (input.type === 'TEXT' || input.type === 'STRING') {
        cy.get(`[data-cy="${input.id}"]`).clear().type('New mock text');
      }
    }

    currentSessionResponse = sessionWithOutput;
    cy.get('[data-cy="generate"]').click();
    cy.get('.sk-dialog .sk-btn-primary').should('have.text', 'Ja, generera om').click();

    cy.get('[data-cy="save-document"]').should('be.disabled');
    cy.wait('@sessionState');

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

  it('Shows and clears stale dependency warnings when earlier steps are rerun', () => {
    cy.get('[data-cy="flow-card-0"]').contains('Flow 1').click();

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

    currentSessionResponse = sessionWithOutput;
    cy.get('[data-cy="generate"]').click();
    cy.wait('@sessionState');

    cy.get('[data-cy="step-stale-indicator-step1"]').should('not.exist');
    cy.get('[data-cy="step-stale-indicator-step2"]').should('not.exist');
    cy.get('[data-cy="step-stale-indicator-step3"]').should('not.exist');

    currentStepExecutions.step1 = stepExecution1Rerun;
    currentSessionResponse = sessionWithStaleDependenciesAfterStep1Rerun;
    cy.get('[data-cy="rerun-step-input-step1"]').type('Uppdatera steg 1');
    cy.get('[data-cy="rerun-step-button-step1"]').click();
    cy.wait('@rerunStep1');
    cy.wait('@sessionState');

    cy.get('[data-cy="step-stale-indicator-step1"]').should('not.exist');
    cy.get('[data-cy="step-stale-indicator-step2"]').should('exist');
    cy.get('[data-cy="step-stale-indicator-step3"]').should('exist');

    cy.contains('2. Steg 2').click();
    cy.get('[data-cy="step-stale-warning-step2"]').should('contain', 'Detta steg kan behöva uppdateras');

    currentStepExecutions.step2 = stepExecution2Rerun;
    currentSessionResponse = sessionWithStaleDependencyAfterStep2Rerun;
    cy.get('[data-cy="rerun-step-input-step2"]').type('Uppdatera steg 2');
    cy.get('[data-cy="rerun-step-button-step2"]').click();
    cy.wait('@rerunStep2');
    cy.wait('@sessionState');

    cy.get('[data-cy="step-stale-indicator-step2"]').should('not.exist');
    cy.get('[data-cy="step-stale-indicator-step3"]').should('exist');

    cy.contains('3. Steg 3').click();
    cy.get('[data-cy="step-stale-warning-step3"]').should('contain', 'Detta steg kan behöva uppdateras');

    currentStepExecutions.step3 = stepExecution3Rerun;
    currentSessionResponse = sessionWithoutStaleDependenciesAfterStep3Rerun;
    cy.get('[data-cy="rerun-step-input-step3"]').type('Uppdatera steg 3');
    cy.get('[data-cy="rerun-step-button-step3"]').click();
    cy.wait('@rerunStep3');
    cy.wait('@sessionState');

    cy.get('[data-cy="step-stale-indicator-step3"]').should('not.exist');
    cy.get('[data-cy="step-stale-warning-step3"]').should('not.exist');
  });
});
