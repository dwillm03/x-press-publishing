const express = require('express');

const artistsRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const printErrorToConsole = (error) => {
  if (error)
  {
    console.log('Error occurred!');
    return;
  }
}

artistsRouter.param('artistId', (req, res, next, artistId) => {
  db.get('SELECT * FROM Artist WHERE id = $artistId', {$artistId: artistId}, (error, row) => {
    printErrorToConsole();
    if (!row)
    {
      res.sendStatus(404);
      return;
    }
    else
    {
    req.artist = row;
    next();
    }
  });
});


artistsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE Artist.is_currently_employed = 1', (error, artists) => {
    printErrorToConsole();
    //req.body.artists = rows;
    res.status(200).json({artists: artists});
  });
});

artistsRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({artist: req.artist});
});

artistsRouter.post('/', (req, res, next) => {
  const name = req.body.artist.name,
        dateOfBirth = req.body.artist.dateOfBirth,
        biography = req.body.artist.biography,
        isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;

  if (!name || !dateOfBirth || !biography) {
    return res.sendStatus(400);
  }

  db.run('INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed)' +
      'VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)', {
        $name: name,
        $dateOfBirth: dateOfBirth,
        $biography: biography,
        $isCurrentlyEmployed: isCurrentlyEmployed
      }, function(error) {
            db.get('SELECT * FROM Artist WHERE Artist.id = $id', {$id: this.lastID}, (error, artist) => {
              res.status(201).json({artist: artist});
            });
          });
});

artistsRouter.put('/:artistId', (req, res, next) => {

  const name = req.body.artist.name;
  const dateOfBirth = req.body.artist.dateOfBirth;
  const biography = req.body.artist.biography;
  const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;

if (!name || !dateOfBirth || !biography)
{
 res.sendStatus(400);
 return;
}
  db.run('UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE id = $id',
        { $name: name,
          $dateOfBirth: dateOfBirth,
          $biography: biography,
          $isCurrentlyEmployed: isCurrentlyEmployed,
          $id: req.params.artistId
        }, function(error) {
        printErrorToConsole();
        db.get('SELECT * FROM Artist WHERE id = $id', {$id: req.params.artistId}, (error, row) => {
          printErrorToConsole();
          res.status(200).json({artist: row});
});
        });
});


artistsRouter.delete('/:artistId', (req, res, next) => {
  db.run('UPDATE Artist SET is_currently_employed = 0 WHERE Artist.id = $artistId', {$artistId: req.params.artistId}, function(error) {
    if (error) {
      next(error);
    }
    else {
    db.get('SELECT * FROM Artist WHERE Artist.id = $artistId', {$artistId: req.params.artistId}, (error, artist) => {
          res.status(200).json({artist: artist});
          next();
    });
  }
  });
});


module.exports = artistsRouter;
