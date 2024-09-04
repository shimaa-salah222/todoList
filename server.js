const express = require('express');
const app = express();
const PORT = 4001;
const todoRouter = require('./todoRouter');
const db = require('./db');







app.use('/', todoRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
  });