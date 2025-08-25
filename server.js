const jsonServer = require('json-server');
const express = require('express');
const path = require('path');

const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({ static: './build' });
const PORT = process.env.PORT || 3001;

// Set default middlewares (logger, static, cors and no-cache)
app.use(middlewares);

// To handle POST, PUT and PATCH you need to use body-parser
app.use(jsonServer.bodyParser);

// Use JSON Server router for /api routes
app.use('/api', router);

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// For any request that doesn't match /api, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});