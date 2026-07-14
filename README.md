# Simple E-Commerce CRUD Application

This is a lightweight e-commerce application designed to simulate a full product management workflow and a basic checkout process. It features a React frontend powered by a Java and Spring Boot backend, utilizing a containerized MariaDB database for robust and persistent data storage.

## Tech Stack

* **Frontend:** React, Vite & Tailwind CSS
* **Backend:** Java, Maven & Spring Boot
* **Database:** MariaDB 11.0
* **Containers:** Docker (v24.0.7+) & Docker Compose (v2.21.0+)

## Key Improvements in v2.0

* **Architectural Refactor:** Introduced a dedicated Service Layer and implemented the DTO pattern.
* **Database Migrations:** Integrated **Flyway** for version-controlled database schema management.
* **High-Performance Data Ingestion:** Implemented batch-processing for CSV files using **OpenCSV**.
* **Robust Error Handling:** Added centralized exception handling with custom domain exceptions.
* **Transactional Checkout:** Finalized the full, end-to-end checkout and transaction workflow.
* **API Enhancements:** Added pagination to listings and created a dedicated API for purchase simulation.
* **DevOps & Testing:** Improved environment variable management and achieved broader coverage with new Unit and Integration tests.
* **Concurrency & Race Condition Safeguards:** Implemented a robust locking mechanism to prevent race conditions during peak checkout traffic, guaranteeing data integrity and safeguarding against negative inventory levels.


## Getting Started

### Prerequisites

Before launching the project, ensure you have the following dependencies installed on your system:
* Docker
* Docker Compose

### Deployment

This project is fully containerized. You can build the images and spin up the entire ecosystem with a single command:

```shell
docker compose up --build --force-recreate
```
**Tip:** Use the `--build --force-recreate` flags if you have previously run this project. This forces Docker to discard cached layers and recreate the containers from scratch, ensuring you are running the newest code.

The `docker-compose.yml` file is configured to manage service dependencies automatically, ensuring the environment initializes in the correct sequence:
```
DATABASE => BACKEND => FRONTEND
```

### Accessing the Application

Once the initialization is complete (you can verify the container status by running `docker ps`, which should show three active containers at this point), open your web browser and navigate to the local environment:
```
http://localhost:3000/
```
### Stopping the Infrastructure

To stop the application and clean up all associated containers, networks, and anonymous volumes, run:

```shell
docker compose down -v
```

**Looking for more details?** 
Please check out our [Repository Wiki](https://github.com/landoicco/ecommerce/wiki) for in-depth information about:
* **Architecture & Design Choices:** Explanations behind the technical decisions.
* **API Documentation:** Comprehensive list of endpoints and usage examples.
* **Project Structure:** How the codebase is organized.

