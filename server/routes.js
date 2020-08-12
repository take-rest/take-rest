const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();

let tableName = "";

if (process.env.NODE_ENV === "test") {
  db = new sqlite3.Database(":memory:");
} else {
  db = new sqlite3.Database("db.sqlite");
}

router.post("/schema", (req, res) => {
  const schema = req.body;
  let tableParams = "";
  tableName = schema.schemaName;

  for (let key in schema.schemaBody) {
    if (schema.schemaBody.hasOwnProperty(key)) {
      let val = "";
      if (key === "id") {
        val = `${schema.schemaBody[key]} PRIMARY KEY AUTOINCREMENT`;
      } else if (schema.schemaBody[key].toUpperCase() === "DATETIME") {
        val = `${schema.schemaBody[key]} DEFAULT CURRENT_TIMESTAMP`;
      } else {
        val = schema.schemaBody[key];
      }
      tableParams += `${key} ${val.toUpperCase()},`;
    }
  }

  tableParams = tableParams.slice(0, -1);

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${tableParams})`);
  });

  res.status(200).json({
    message: "Schema created successfully...",
  });
});

router.get("/", (req, res) => {
  db.serialize(() => {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
      res.json(rows);
    });
  });
});

router.post("/", (req, res) => {
  const body = req.body;

  const keys = Object.keys(body);
  const values = Object.values(body);

  let insertParams = keys.map((key) => `${key}`).join(",");
  let insertValues = values.map((value) => "?").join(",");

  let sql = `INSERT INTO ${tableName} (${insertParams}) VALUES (${insertValues})`;

  db.run(sql, values, function (err) {
    if (err) {
      res.json(err.message);
    }
    res.json(`Rows inserted ${this.changes}`);
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.serialize(() => {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run(id);
    stmt.finalize();
    res.json(req.body);
  });
});

module.exports = router;
