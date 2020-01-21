import DB from 'sqlite3';
const sqlite3 = DB.verbose();

/**
 * Get Users
 * @param {*} req request
 * @param {*} res response
 */
export const getUsers = (req, res) => {
  const db = new sqlite3.Database('codestonedb.sql');
  const sql = 'SELECT * FROM users';
  db.all(sql, (err, rows) => {
    res.json({ users: rows });
  })
}



/**
 * Add Question
 * @param {*} req request
 * @param {*} res response
 */
const addQuestion = (req, res) => {
  const db = new sqlite3.Database('codestonedb.sql');
  const stmt = db.prepare('INSERT INTO questions VALUES (?, ?)');
  const { question, user_id } = req.body;
  stmt.run(question, user_id);
  stmt.finalize();
  res.json({ message: 'Question added?' });
}

module.exports.addQuestion = addQuestion;