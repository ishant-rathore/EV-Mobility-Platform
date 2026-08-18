# Logger Package Boundary

The API currently owns its Pino setup. A workspace logger is deferred until another Node.js runtime requires the same logging conventions.
