const express = require('express');
const seriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const issuesRouter = require('./issues.js');

const printErrorToConsole = (error) => {
  if (error)
  {
    console.log('Error occurred!');
    return;
  }
}

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  db.get('SELECT * FROM series WHERE id = $seriesId', {$seriesId: seriesId}, (error, series) => {
    printErrorToConsole();
    if (!series)
    {
      res.sendStatus(404);
    }
    else
    {
    req.series = series;
    next();
    }
  });
});

seriesRouter.use('/:seriesId/issues', issuesRouter);

seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (error, series) => {
    //printErrorToConsole();
    //req.body.seriess = rows;
    res.status(200).json({series: series});
  });
});

seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).json({series: req.series});
});

seriesRouter.post('/', (req, res, next) => {
  const name = req.body.series.name,
        description = req.body.series.description;

  if (!name || !description) {
    res.sendStatus(400);
    return;
  }

  db.run('INSERT INTO Series (name, description)' +
      'VALUES ($name, $description)', {
        $name: name,
        $description: description
      }, function(error) {
            db.get('SELECT * FROM Series WHERE series.id = $id', {$id: this.lastID}, (error, series) => {
              res.status(201).json({series: series});
            });
          });
});

seriesRouter.put('/:seriesId', (req, res, next) => {
  const name = req.body.series.name;
  const description = req.body.series.description;

if (!name || !description)
{
 res.sendStatus(400);
 return;
}
  db.run('UPDATE Series SET name = $name, description = $description WHERE id = $id',
        { $name: name,
          $description: description,
          $id: req.params.seriesId
        }, function(error) {
        //printErrorToConsole();
        db.get('SELECT * FROM Series WHERE id = $id', {$id: req.params.seriesId}, (error, row) => {
          //printErrorToConsole();
          res.status(200).json({series: row});
});
        });
});

seriesRouter.delete('/:seriesId', (req, res, next) => {
    db.get('SELECT * FROM Issue WHERE $seriesId = Issue.series_id', {$seriesId: req.params.seriesId}, (error, series) => {
      //printErrorToConsole();
      if (series)
      {
        res.sendStatus(400);
      }
      else
      {
        db.run('DELETE FROM Series WHERE Series.id = $seriesId', {$seriesId: req.params.seriesId}, (error) => {
        res.sendStatus(204);
      });
    }
  });
});


module.exports = seriesRouter;
