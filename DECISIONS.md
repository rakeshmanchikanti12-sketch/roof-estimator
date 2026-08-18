# Decisions

## 1. Architecture

I used a MERN-style architecture.

- React + Vite for the public estimator and owner panel
- Node.js + Express for the API
- MongoDB for configuration and lead storage

I separated the client and server into `client` and `server` folders so each part can be developed and deployed independently.

## 2. Configuration-Driven Estimator

The estimator questions, labels, options, rates, multipliers, and pricing modifiers are stored in MongoDB.

The frontend requests the active configuration from the API at runtime.

This means changing a question or pricing value through the owner panel does not require a frontend redeployment.

This follows the main requirement of the assignment that configurable estimator data must not be hardcoded in the frontend.

## 3. Calculation Formula

The calculation runs on the server.

The material rate is selected from the stored configuration.

The roof area is adjusted using the waste factor.

The material cost and tear-off cost are calculated from the configured rates.

Pitch and stories apply their configured multipliers.

The permit fee is added as a flat amount.

The resulting estimate is converted into a low and high range using the configured range spread percentage.

The server returns the calculated estimate and stores the answers together with the lead.

I did not attempt to reproduce the historical seed estimates exactly because the assignment explicitly states that the historical figures do not need to match the new calculation formula.

## 4. Admin Configuration

The owner panel allows the owner to update business information, estimator questions, question options, rates, multipliers, and pricing modifiers.

I used Basic Authentication for the owner panel because the assignment states that basic authentication is acceptable for this task.

## 5. Validation

The estimator validates required fields before submitting the lead.

The roof area uses the configured minimum and maximum values.

The backend performs the calculation using the stored configuration rather than trusting a calculated value from the browser.

## 6. What I Did Not Build

I did not build the optional stretch features such as CSV export, outbound webhooks, full configuration history, or adding completely new question types.

I prioritized the required estimator, configuration management, lead management, authentication, database persistence, and deployment.

## 7. Seed Data

I used configuration version 3 as the starting configuration.

The provided configuration contains the current roofing materials, pitch multipliers, tear-off rates, stories multipliers, waste factor, permit fee, and range spread.

I treated the provided configuration as the source of truth for the estimator.

## 8. Questions for the Client

Before a production launch, I would confirm:

- Whether the estimate should include tax.
- Whether the permit fee differs by project location.
- Whether labor rates vary by roof type.
- Whether there are additional charges for chimneys, skylights, gutters, or other roof features.
- Whether the estimate range should use a fixed percentage or different percentages by material.
- Which users should have owner-panel access.
- Whether leads need CSV export or integration with another CRM.

## 9. If I Had Another Week

I would add:

- Automated tests for the calculation service.
- Configuration version history.
- CSV lead export.
- Better authentication and role management.
- More detailed backend validation.
- Improved mobile UX.
- Production logging and monitoring.
- Additional estimator questions through the owner panel.