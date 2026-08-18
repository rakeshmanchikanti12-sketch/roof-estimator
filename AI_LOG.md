# AI Log

## Tools Used

I used ChatGPT as an AI development assistant during this project.

I used it for:

- Planning the application structure.
- Reviewing React and Express code.
- Debugging PowerShell and npm issues.
- Writing and reviewing MongoDB models.
- Working through API integration.
- Debugging the Render deployment.
- Reviewing Git and GitHub commands.
- Preparing project documentation.

## How AI Helped

AI helped me work through implementation and debugging issues faster.

I used AI suggestions as a starting point, then tested the changes locally and on the deployed application.

I verified the estimator flow by submitting test leads and checking the returned estimate and stored lead data.

## Example of Incorrect AI Output

One issue occurred during deployment when the frontend was configured with the wrong build command.

The deployment attempted to run an incorrect command and produced a `Missing script: "buildnpm"` error.

I checked the Render logs, identified the incorrect command, and changed the build command to:

`npm install && npm run build`

The next deployment completed successfully.

## My Own Work and Verification

I implemented and tested the application with the assistance of AI.

I verified the configuration-driven estimator against the MongoDB configuration.

I tested the API using PowerShell.

I tested the admin login, lead management, configuration updates, and estimate submission.

I also deployed the frontend and backend and verified the complete production flow.

The final deployed estimator successfully loaded configuration from the backend, calculated an estimate, and stored the submitted lead.

## Ownership

I reviewed the generated code, made changes when required, tested the application, debugged deployment issues, and verified the final behavior before submission.