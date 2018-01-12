const express = require('express');

const issuesRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

/* const printErrorToConsole = (error) => {
  if (error)
  {
    console.log('Error occurred!');
    return;
  }
} */

issuesRouter.param('issueId', (req, res, next, issueId) => {
  db.get('SELECT * FROM Issue WHERE Issue.id = $issueId', {$issueId: issueId}, (error, row) => {
    //printErrorToConsole();
    if (!row)
    {
      res.sendStatus(404);
    }
    else
    {
    //req.issues = row;
    next();
    }
  });
});

issuesRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Issue WHERE Issue.series_id = $seriesId';
  const values = { $seriesId: req.params.seriesId };
  db.all(sql, values, (error, issues) => {
    if (error)
    {
      next(error);
    }
    else
    {
      res.status(200).json({issues: issues});
    }
  });
});

issuesRouter.post('/', (req, res, next) => {
  const name = req.body.issue.name,
        issueNumber = req.body.issue.issueNumber,
        publicationDate = req.body.issue.publicationDate,
        artistId = req.body.issue.artistId;
db.get('SELECT * FROM Artist WHERE Artist.id = $artistId', {$artistId: artistId}, (error, artist) => {
  if (!name || !issueNumber || !publicationDate || !artist)
  {
    return res.sendStatus(400);
  }
  const sql = 'INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id)' +
          'VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)';
      const values = {
        $name: name,
        $issueNumber: issueNumber,
        $publicationDate: publicationDate,
        $artistId: artistId,
        $seriesId: req.params.seriesId
      };
  db.run(sql, values, function() {
          db.get('SELECT * FROM Issue WHERE $id = Issue.id', {$id: this.lastID}, (error, issue) => {
            res.status(201).json({issue: issue});
          });
        });
      });
});

issuesRouter.put('/:issueId', (req, res, next) => {
  const name = req.body.issue.name,
        issueNumber = req.body.issue.issueNumber,
        publicationDate = req.body.issue.publicationDate,
        artistId = req.body.issue.artistId;
db.get('SELECT * FROM Artist WHERE Artist.id = $artistId', {$artistId: artistId}, (error, artist) => {
if (!name || !issueNumber || !publicationDate || !artist)
{
 res.sendStatus(400);
 return;
}
  db.run('UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId WHERE Issue.id = $id',
  {$name: name, $issueNumber: issueNumber, $publicationDate: publicationDate, $artistId: artistId, $id: req.params.issueId}, (error, issue) => {
          db.get('SELECT * FROM Issue WHERE Issue.id = $id', {$id: req.params.issueId}, (error, issue) => {
          //printErrorToConsole();
          res.status(200).json({issue: issue});
});
        });
});
});

issuesRouter.delete('/:issueId', (req, res, next) => {
        db.run('DELETE FROM Issue WHERE Issue.id = $id', {$id: req.params.issueId}, (error) => {
        res.sendStatus(204);
      });
  });

module.exports = issuesRouter;
