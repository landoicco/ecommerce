# Simple E-Commerce CRUD Application

This is a lightweight e-commerce application designed to simulate a full product management workflow and a basic checkout process. It features a React frontend powered by a Java and Spring Boot backend, utilizing an in-memory H2 database for rapid development and testing.

The core philosophy of this project is to remain as simple and effective as possible, strictly adhering to the **YAGNI** (You Aren't Gonna Need It) design principle.

## Tech Stack

* **Frontend:** React, Vite & Tailwind CSS
* **Backend:** Java, Maven & Spring Boot
* **Database:** H2 (In-Memory)
* **Containers:** Docker (v24.0.7+) & Docker Compose (v2.21.0+)

## Features

This project supports the essential core operations required in a production-level e-commerce application:

* **Full CRUD Operations**: Complete data management seamlessly integrated across both the frontend and backend.
  * **Create**: A button in the top-right corner of the UI allows you to add a new product. Filling out the form saves the object to the database and dynamically updates the interface.
  * **Read**: Products are fetched directly from the backend database and rendered dynamically as cards on the UI.
  * **Update**: Hovering over any product card reveals an edit option. The UI adapts into an editable state, pushing changes to the database and updating the interface instantly.
  * **Delete**: Hovering over a product card also exposes a delete action, which permanently removes the item from both the database and the UI.
* **Search Functionality**: A search bar in the top-right corner filters products dynamically by name, SKU, or category.
* **Purchase Simulation**: Each product card features a buy button. Clicking it reduces the item's database stock by one unit. Once an item's stock reaches zero, the purchase option becomes automatically disabled.

## Getting Started

### Prerequisites

Before launching the project, ensure you have the following dependencies installed on your system:
* Docker
* Docker Compose

### Deployment

This project is fully containerized. You can build the images and spin up the entire ecosystem with a single command:

```shell
docker compose up
```

The `docker-compose.yml` file is configured to manage service dependencies automatically, ensuring the environment initializes in the correct sequence:
```
BACKEND => FRONTEND
```
### Accessing the Application

Once the initialization is complete (you can verify the container status by running `docker ps`), open your web browser and navigate to the local environment:
```
http://localhost:3000/
```
### Stopping the Infrastructure

To stop the application and clean up all associated containers, networks, and anonymous volumes, run:

```shell
docker compose down -v
```
## Additional Information
To interact directly with the backend API, you can utilize the following endpoints:
To `GET` all products:

```
http://localhost:8080/api/products
```
To `DELETE`:
```
http://localhost:8080/api/products/delete/{id}
```
To `PUT` (modify entry):
```
http://localhost:8080/api/products/edit/{id}
```
To `POST`:
```
http://localhost:8080/api/products
```

## Design Choices

### Data Seeding and Initialization
The application initializes its state using dataset records parsed from a local CSV file. To streamline this process, we utilize Spring's `CommandLineRunner` interface to automatically parse and load the data into the H2 database at application startup. This architecture guarantees that a complete dataset is fully available to the user the moment the frontend interface loads.

### Monolithic Single-Page UI
To strictly adhere to the **YAGNI** (You Aren't Gonna Need It) design principle, the entire frontend is structured around a single-page dashboard. Features are implemented exclusively to satisfy core system requirements without introducing speculative complexity or redundant routing frameworks. This architectural choice prioritizes a high-utility, zero-overhead solution that remains highly maintainable.

