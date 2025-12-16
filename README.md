# FrontendProjet

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Prerequisites

- **Node.js**: Version 20.19+ or 22.12+ (required for Angular CLI 20.3.9)
- **npm**: Comes with Node.js

## Project Overview

This is an Angular application with authentication features including:
- User registration
- User login
- Protected routes with auth guards
- Dashboard with user information
- Home page with welcome message

### Default Credentials
- Username: `admin`
- Password: `admin`

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Backend dependency

This UI consumes the Spring Boot API located in `../ride_the_trocking`:

1. Start MariaDB and launch the backend with `mvn spring-boot:run`
2. Start the Angular dev server with `npm start`

API requests default to `http://localhost:8080/api`. To point the app to a different backend, define `window.__env.API_BASE_URL` in `public/env.js` (loaded from `index.html`) before building/serving the app.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
