# Tugma - Where Ends Meet

*Description here*

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed (includes Docker and Docker Compose)
- [Git](https://git-scm.com/downloads) for cloning the repository

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sheowl/tugma.git
   cd tugma
   ```

2. **Set up environment files:**
   - You will need the .env/db, .env/web, and .env/backend files with database credentials
   - These files will be shared separately in the group chat to maintain security
   - Place them in the .env/ directory of the project 

3. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

## Additional Setup (When Needed)

*Additional Setup here*

## Development Workflow

- **Start:** `docker-compose up`
- **Stop:** `docker-compose down`
- **Rebuild:** `docker-compose up --build`
- **View logs:** `docker-compose logs [service_name]`

## Troubleshooting

**Common Issues:**
- **Port conflicts:** `docker-compose down` then try again
- **Build issues:** `docker-compose build --no-cache`
- **Database issues:** Ensure environment variables match in both `.env` files