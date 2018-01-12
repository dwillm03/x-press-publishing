const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS `Artist` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`name` TEXT NOT NULL, ' +
           '`date_of_birth` TEXT NOT NULL, ' +
           '`biography` TEXT NOT NULL, ' +
           '`is_currently_employed` INTEGER NOT NULL DEFAULT 1, ' +
           'PRIMARY KEY(`id`) )');

  db.run('CREATE TABLE IF NOT EXISTS `Series` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`name` TEXT NOT NULL, ' +
           '`description` TEXT NOT NULL, ' +
           'PRIMARY KEY(`id`) )');

  db.run('CREATE TABLE IF NOT EXISTS `Issue` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`name` TEXT NOT NULL, ' +
           '`issue_number` INTEGER NOT NULL, ' +
           '`publication_date` TEXT NOT NULL, ' +
           '`artist_id` INTEGER NOT NULL, ' +
           '`series_id` INTEGER NOT NULL, ' +
           'PRIMARY KEY(`id`), ' +
           'FOREIGN KEY(`artist_id`) REFERENCES `Artist`(`id`), ' +
           'FOREIGN KEY(`series_id`) REFERENCES `Series`(`id`) )');
});

/*
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const tableCreateError = () => {
  console.log('Error creating table.');
}

const createArtistTable = () => {
db.serialize(() => {
  db.run('DROP TABLE IF EXISTS Artist', error => {
    if (error){
      throw error;
    }
    });
  db.run('CREATE TABLE Artist(id INTEGER PRIMARY KEY, name TEXT NOT NULL, date_of_birth TEXT NOT NULL, biography TEXT NOT NULL, is_currently_employed INTEGER DEFAULT 1)', (error) =>
    {
      if (error)
      {
        tableCreateError();
      }
    });
});
}

const createSeriesTable = () => {
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Series', error => {
      if (error){
        throw error;
      }
      });
  db.run('CREATE TABLE Series(id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL)', (error) =>
    {
      if (error)
      {
        tableCreateError();
      }
    });
});
}

const createIssueTable = () => {
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Issue', error => {
      if (error)
      {
        throw error;
      }
    });

  db.run('CREATE TABLE `Issue` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`name` TEXT NOT NULL, ' +
           '`issue_number` INTEGER NOT NULL, ' +
           '`publication_date` TEXT NOT NULL, ' +
           '`artist_id` INTEGER NOT NULL, ' +
           '`series_id` INTEGER NOT NULL, ' +
           'PRIMARY KEY(`id`), ' +
           'FOREIGN KEY(`artist_id`) REFERENCES `Artist`(`id`), ' +
           'FOREIGN KEY(`series_id`) REFERENCES `Series`(`id`) )');
});
}




module.exports = {createIssueTable, createSeriesTable, createArtistTable};
*/
