const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
//const {createIssueTable, createSeriesTable, createArtistTable} = require('./migration.js');
const morgan = require('morgan');
const apiRouter = require('./api/api.js');
const app = express();
const PORT = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use(cors());

app.use('/api', apiRouter);
app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
/*  createSeriesTable();
  createArtistTable();
  createIssueTable(); */
});

module.exports = app;
