# Double Entry Accounting System

A comprehensive web-based double-entry accounting system designed for small to medium businesses. This project utilizes a modern split architecture with a Spring Boot backend and a React (Vite) frontend.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Accounting
- **Double-Entry Bookkeeping** - Full support for debit and credit accounting with automatic balance validation.
- **Chart of Accounts** - Flexible hierarchical account structure (Asset, Liability, Equity, Revenue, Expense).
- **Journal Entries** - Create, edit, post, and void journal entries with comprehensive validation.
- **General Ledger** - Complete transaction history with running balances.

### Financial Reports
- **Trial Balance** - Verify debits equal credits at any point in time.
- **Profit & Loss Statement** - Income statement for any date range.
- **Balance Sheet** - Financial position as of any date.
- **General Ledger Report** - Detailed account transaction history.

### User Interface
- **Modern Dashboard** - Real-time financial overview with interactive charts.
- **Responsive Design** - Built with Bootstrap 5 and React for a seamless experience on any device.
- **Dark Mode** - Integrated dark theme support.

### Administration
- **User Management** - Role-based access control (Admin, Accountant, Viewer).
- **Audit Trail** - Track who created and modified entries.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Database**: MySQL 8.0 (Production), H2 (Development)
- **ORM**: Hibernate / Spring Data JPA
- **Security**: Spring Security 6 (JWT/Session)
- **Testing**: JUnit 5, Cucumber, Mockito

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Bootstrap 5, React Bootstrap
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animation**: Framer Motion

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (serving Frontend)

## Quick Start

The easiest way to run the application is using Docker Compose.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd accounting-system
    ```

2.  **Start the services:**
    ```bash
    docker-compose up --build
    ```

3.  **Access the application:**
    - **Frontend**: [http://localhost:80](http://localhost:80)
    - **Backend API**: [http://localhost:8080](http://localhost:8080)
    - **Database**: Port 3306

    **Default Credentials:**
    - Username: `admin`
    - Password: `admin` (or as configured in `application.properties`)

## Architecture

The system follows a modern split architecture, separating the backend API from the frontend user interface.

```
┌─────────────────────────────┐      ┌─────────────────────────────┐
│       Frontend (UI)         │      │       Backend (API)         │
│                             │ REST │                             │
│  React / Vite / Bootstrap   │<────>│  Spring Boot / Java 17      │
│  (Served via Nginx)         │ JSON │  (Controllers, Services)    │
└─────────────────────────────┘      └─────────────────────────────┘
                                                    │
                                                    │ JPA / Hibernate
                                                    ▼
                                     ┌─────────────────────────────┐
                                     │         Database            │
                                     │       MySQL / H2            │
                                     └─────────────────────────────┘
```

## Installation

If you prefer to run the services manually (without Docker), follow these steps.

### Prerequisites
- **Java 17** SDK
- **Maven 3.6+**
- **Node.js 18+** & **npm**
- **MySQL 8.0** (optional, defaults to H2 for local dev)

### Backend Setup

1.  Navigate to the project root:
    ```bash
    cd accounting-system
    ```

2.  Build and run the Spring Boot application:
    ```bash
    mvn spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.
    *By default, it uses an in-memory H2 database. Access H2 Console at `/h2-console`.*

### Frontend Setup

1.  Navigate to the `ui` directory:
    ```bash
    cd ui
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will start (usually on `http://localhost:5173`) and proxy API requests to the backend.

## Configuration

### Backend Configuration
The backend is configured via `src/main/resources/application.properties`.

**Key Properties:**
- `server.port`: API port (default: 8080)
- `spring.datasource.url`: Database connection URL.
- `spring.jpa.hibernate.ddl-auto`: Schema generation strategy.

To switch to MySQL, uncomment the MySQL configuration block in `application.properties` or use environment variables:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/accounting_db
export SPRING_DATASOURCE_USERNAME=user
export SPRING_DATASOURCE_PASSWORD=pass
```

### Frontend Configuration
Frontend build configuration is handled in `ui/vite.config.js`. API base URL defaults can be configured there or via environment variables if set up.

## API Endpoints

The backend provides a RESTful API. Key endpoints include:

- **Authentication**
  - `POST /users/register`: Register a new user.
  - `POST /login`: Authenticate user.

- **Accounts**
  - `GET /accounts`: List all accounts.
  - `POST /accounts/save`: Create or update an account.

- **Journal Entries**
  - `GET /journal`: List journal entries.
  - `POST /journal/save`: Save a new entry.
  - `POST /journal/post/{id}`: Post a draft entry.

- **Reports**
  - `GET /reports/trial-balance`
  - `GET /reports/profit-loss`
  - `GET /reports/balance-sheet`

*Note: Most endpoints require authentication.*

### API Documentation (Swagger/OpenAPI)
The API documentation is available via Swagger UI when the application is running.

- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

## Database Schema

The database schema includes the following core tables:
- `users`, `roles`: Authentication and Authorization.
- `accounts`: Chart of Accounts hierarchy.
- `journal_entries`, `journal_entry_lines`: Double-entry transaction records.
- `invoices`, `customers`: Billing and receivables.

## Testing

### Backend Tests
The backend uses JUnit 5 for unit tests and Cucumber for BDD acceptance tests.

```bash
# Run all tests
mvn test

# Run Cucumber tests specifically
mvn test -Dtest=RunCucumberTest
```

### Frontend Tests
(Add frontend testing instructions if implemented, e.g., `npm test`)

## Deployment

### Docker (Production)
The provided `docker-compose.yml` is suitable for production-like deployments. Ensure you update the default passwords and secrets in `docker-compose.yml` and `application.properties`.

### Manual Deployment
1.  **Backend**: Build the JAR (`mvn package`) and run it (`java -jar target/accounting-system-*.jar`).
2.  **Frontend**: Build the static assets (`npm run build` in `ui/`) and serve the `ui/dist` folder using a web server like Nginx or Apache.

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

## License

This project is licensed under the MIT License.
