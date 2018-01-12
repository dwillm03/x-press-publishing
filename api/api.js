const express = require('express');
const apiRouter = express.Router();

const artistsRouter = require('./artist.js');
apiRouter.use('/artists', artistsRouter);

const seriesRouter = require('./series.js');
apiRouter.use('/series', seriesRouter);

module.exports = apiRouter;
