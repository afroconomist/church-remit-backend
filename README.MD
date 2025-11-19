# Node Project Template

This project serves as a template for building Node.js applications using TypeScript. It provides a structured setup with useful tools for development, testing, and code quality.

## Project Setup

To set up the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd node-project-template
npm install
```

## Environment Variables

This project uses environment variables to configure the database, application, and Redis settings and other configurations. Create a `.env` file in the root directory and add the following variables:

```bash
# Database Configuration
DB_CLIENT=postgres
DB_DATABASE=
DB_HOST=localhost
DB_PASSWORD=
DB_USERNAME=
DB_PORT=

# Application Configuration
APP_NAME=
APP_HOME=127.0.0.1
PORT=3000

# Redis Configuration
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_USERNAME=
```

## Scripts

The project includes a variety of npm scripts to help with development, testing, and deployment:

- **Development:**
  - `npm run start:dev`: Starts the development server with `nodemon` for auto-reloading.
- **Production:**

  - `npm run build`: Compiles the TypeScript code to JavaScript.
  - `npm run start`: Starts the server using the compiled JavaScript files.

- **Testing:**
  - `npm run test`: Runs tests using Jest.
- **Linting:**

  - `npm run lint`: Lints the code using ESLint.
  - `npm run lint:fix`: Lints and automatically fixes issues.

- **Database:**
  - `npm run db:migrate:make <name>`: Creates a new migration file.
  - `npm run db:migrate`: Runs all pending migrations.
  - `npm run db:migrate:rollback`: Rolls back the last set of migrations.
  - `npm run db:seed`: Runs all seed files.

## Module Aliases

The project uses module aliases for cleaner import statements. The following aliases are configured:

- `@config`: Refers to `dist/config`.
- `@shared`: Refers to `dist/shared`.
- `@utils`: Refers to `dist/shared/utils`.

These aliases allow you to import modules using simple paths, e.g., `import config from '@config'`.

## Linting and Formatting

The project uses ESLint for code linting and Prettier for code formatting. Linting is configured to run on all JavaScript and TypeScript files. The `lint-staged` configuration ensures that only staged files are linted and formatted before committing.

## Database Migrations and Seeding

This project uses Knex.js for database migrations and seeding. The following commands are available:

- `npm run db:migrate:make <name>`: Create a new migration file.
- `npm run db:migrate`: Apply all pending migrations.
- `npm run db:migrate:rollback`: Roll back the last migration batch.
- `npm run db:seed`: Run all seed files.

Ensure you have the correct database configuration in your environment variables.

## Dependencies

This project includes a set of essential dependencies and development tools:

### Dependencies

- `axios`: HTTP client for making requests.
- `bcrypt`: Library for hashing passwords.
- `cors`: Middleware for enabling CORS.
- `express`: Web framework for building APIs.
- `jsonwebtoken`: For generating and verifying JSON Web Tokens (JWT).
- `knex`: SQL query builder for Node.js.
- `objection`: ORM built on top of Knex.js.
- `pg`: PostgreSQL client for Node.js.
- ...and many more.

### Dev Dependencies

- `typescript`: TypeScript language support.
- `eslint`: Linting tool for ensuring code quality.
- `jest`: JavaScript testing framework.
- `nodemon`: Utility that automatically restarts the node application when file changes are detected.
- ...and many more.

## Author

This project was created and maintained by [Segun Aderinola](https://segunaderinola.com/). If you have any questions or feedback, feel free to reach out.

---
