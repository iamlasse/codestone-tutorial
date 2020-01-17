const sqlite3 = require('sqlite3').verbose()

/**
 * Add Question
 * @param {*} req request
 * @param {*} res response
 */
const add = (req, res) => {
  const db = new sqlite3.Database('codestonedb.sql');
  const stmt = db.prepare('INSERT INTO questions VALUES (?, ?)');
  const { question } = req.body;
  const { username } = req.user;
  const sql = 'SELECT rowid as id FROM users WHERE username = ?';
  db.get(sql, [username], (err, { id }) => {
    if (err) {
      res.status(500).json({ message: 'users can only add to their own questions' });
    }
    stmt.run(question, id);
    stmt.finalize();
    res.json({ message: 'Question added?' });
  })
}

module.exports.add = add;

/**
 * Get Questions for User
 * @param {*} req request
 * @param {*} res response
 */
const getAll = (req, res) => {
  console.log('Questions works', req.user);
  const { id } = req.user;

  db = new sqlite3.Database('codestonedb.sql');
  const sql = 'SELECT * from questions WHERE user_id = ?';
  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Nothing found')
    }
    console.log('Questions found ', rows);
    res.json({ id, questions: rows })
  })
  db.close()
}

module.exports.getAll = getAll;