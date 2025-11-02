// Vercel Serverless Function Handler
// This file exports the Express app as a serverless function

import("../dist/index.js")
  .then(module => {
    // Export the Express app for Vercel
    module.default;
  })
  .catch(err => {
    console.error("Failed to load server:", err);
  });
