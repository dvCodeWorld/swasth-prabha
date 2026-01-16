const express = require('express');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const PORT = process.env.PORT || 3000;

const apiRouter = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.use('/api', middlewares);
app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, 'dist/swasth-prabha/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/swasth-prabha/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
