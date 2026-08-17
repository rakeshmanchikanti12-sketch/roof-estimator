# Northline Roofing & Exteriors Roof Estimator

A full-stack roof estimation application for Northline Roofing & Exteriors in Columbus, Ohio.

The application collects roof information from customers, calculates an estimated roofing cost, stores customer leads in MongoDB, and provides an admin panel for managing leads and estimator configuration.

## Features

### Customer Estimator

- Roof area input in square feet
- Roofing material selection
- Roof pitch selection
- Existing roofing layer selection
- Number of house stories
- Customer name, phone, and email
- Automatic estimate calculation
- Estimated cost range
- Configuration version display
- Successful lead submission

### Admin Panel

- Admin login
- View submitted leads
- View customer information
- View estimate amounts
- View configuration version
- Delete leads
- Manage estimator configuration
- Update business information
- Update estimator questions
- Update pricing modifiers

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- Mongoose
- MongoDB
- dotenv

## Project Structure

```text
roof-estimator/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── AdminConfig.jsx
│   │   │   ├── AdminLeads.jsx
│   │   │   └── AdminLogin.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── configController.js
│   │   │   └── estimateController.js
│   │   ├── models/
│   │   │   ├── Config.js
│   │   │   └── Lead.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── configRoutes.js
│   │   │   └── estimateRoutes.js
│   │   ├── services/
│   │   │   └── calculator.js
│   │   ├── index.js
│   │   └── seed.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md