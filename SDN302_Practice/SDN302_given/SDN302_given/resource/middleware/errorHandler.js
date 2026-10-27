// Middleware for handling 404 - Not Found for unmapped routes
exports.notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
};

// Global error handling middleware - always returns JSON
exports.globalErrorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
  });
};
