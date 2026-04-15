---
description: Read this file to understand how to fetch data in the project.
applyTo: **/*.ts, **/*.js
---
# Data Fetching Guidelines

When fetching data in the project, follow these guidelines to ensure consistency and maintainability: 

## 1. Use Async/Await
## 2. Handle Errors Gracefully
## 3. Use Fetch API or Axios
## 4. Cache Data When Appropriate
## 5. Avoid Fetching Data in Components Directly
## 6. Use Environment Variables for API Endpoints
## 7. Clean Up Subscriptions and Async Tasks
## 8. Document Your Data Fetching Logic
## 9. Test Your Data Fetching Logic
## 10. Follow the DRY Principle
## 11. ALWAYS using server Components for data fetching. NEVER use client components for data fetching.
## 12. ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in the components.
## 13. All helper fuctions in the /data directory should use Drizzle ORM for database interactions. 

By adhering to these guidelines, you can ensure that your data fetching logic is efficient, maintainable, and consistent across the project.
