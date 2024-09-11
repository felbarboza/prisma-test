## Blog & Post Backend

### Env

I'm using node 20 and Docker version 27.2.1

### Running

Start Postgres Database: Ensure Docker is installed and running, then start the Postgres database on port 5432 by running:

```
docker compose up --build
```

Install Dependencies: Install all required dependencies by running:

```
npm install
```

Run Migrations: Apply the database migrations to set up the schema:

```
npm run migrate
```

Start the Service: Launch the service in development mode:

```
npm run dev
```

Run unit tests

```
npm run test
```

API Endpoints

Create a Blog
Method: POST
URL: http://localhost:3333/api/v1/blogs

Create a Post
Method: POST
URL: http://localhost:3333/api/v1/posts

Get a Blog by ID
Method: GET
URL: http://localhost:3333/api/v1/blogs/:id?includePosts=true|false

Get a Blog by Slug
Method: GET
URL: http://localhost:3333/api/v1/blogs/slug/:slug?includePosts=true|false

### What were some of the reasons you chose the technology stack that you did?

I chose Express for its simplicity, making it easy to set up a basic service quickly. Postgres was selected due to it being robust for relational data and my familiarity with it. For this version of the service, which doesn't need to handle production-level traffic or scalability, Express and Postgres provide a good balance of being easy to develop and performance.

### What were some of the trade-offs you made when building this application? Why were these acceptable trade-offs?

One trade-off was not focusing on advanced dependency inversion with containers (like tsyringe) and leaving out end-to-end tests. Given the simplicity and scope of the challenge, I prioritized getting the core functionality.

### Given more time, what improvements or optimizations would you want to add? When would you add them?

I would add:

- End-to-end and stress testing to ensure the service performs well under concurrency and to identify bottlenecks. This is critical once the service is close to production.
- Dependency injection improvements would come if we think there will be the need to switch databases or add more abstraction layers.
- Caching with Redis would be necessary to improve read performance under heavy load.
- Prisma ORM would help in optimizing database queries and ensuring maintainable data models as the application grows.
- Dockerize it for maintaining environment consistency across development and production, especially when the team scales.
- API documentation for when collaborating with teams or if external integrations were needed.

### What would you need to do to make this application scale to hundreds of thousands of users?

I would:

- Ensure horizontal scalability by deploying in a containerized environment with load balancers.
- Implement autoscaling in response to traffic spikes.
- Use caching (Redis or similar) to reduce the load on the database for frequent queries.
- Scale the database horizontally by using read replicas and optimize it with proper indexing and query optimizations.
- Depending on the company architecture, I would consider making the system event-based (using RabbitMQ or Kafka) to prevent data loss during outages by queuing requests and processing them asynchronously.

### How would you change the architecture to allow for models that are stored in different databases? E.g. posts are stored in Cassandra and blogs are stored in Postgres.

To handle models in different databases, I would abstract the business logic from the database layers by creating distinct repository interfaces for each.
The services would interact with these repositories, allowing easy swapping of databases. If there are operations across different databases, I would ensure they are handled in separate transactions, potentially dealing with eventual consistency where needed. I'd also add integration mechanisms (like queues) to handle complex operations across databases.

### How would you deploy the Architecture you designed in a production ready way?

I would:

- Containerize the application with Docker to ensure consistency across environments.
- Use Terraform to define and manage infrastructure, probably using AWS ECS for auto-scaling and ease of deployment.
- Integrate monitoring tools (like Datadog, Grafana, etc) and logging systems to track service health and performance.
- Set up CI/CD pipelines to automate testing, deployment, and scaling based on traffic.
- Additionally, enable Redis caching and load balancers to handle high traffic.
