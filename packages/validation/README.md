# Validation Package Boundary

Zod schemas currently belong to the backend HTTP modules that use them. Extract a schema here only when the web app or another trusted TypeScript consumer needs the exact same validation contract.
