const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();

if (process.env.NODE_ENV === "test") {
  db = new sqlite3.Database(":memory:");
} else {
  db = new sqlite3.Database("db.sqlite");
}

router.post("/schema", (req, res) => {
  const schema = req.body;
  let tableParams = "";

  for (let key in schema.schemaBody) {
    if (schema.schemaBody.hasOwnProperty(key)) {
      let val = "";
      if (key === "id") {
        val = `${schema.schemaBody[key]} PRIMARY KEY AUTOINCREMENT`;
      } else if (schema.schemaBody[key].toUpperCase() === "DATETIME") {
        val = `${schema.schemaBody[key]} DEFAULT CURRENT_TIMESTAMP`;
      } else if (schema.schemaBody[key].toUpperCase() === "DATE") {
        val = `${schema.schemaBody[key]} DEFAULT CURRENT_DATE`;
      } else {
        val = schema.schemaBody[key];
      }
      tableParams += `${key} ${val.toUpperCase()},`;
    }
  }

  tableParams = tableParams.slice(0, -1);

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS ${schema.schemaName} (${tableParams})`,
      [],
      (err) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
          return false;
        }
        res.status(200).json({
          message: "Schema created successfully...",
          data: schema.schemaBody,
        });
      }
    );
  });
});

//get perticular data or all data
router.get("/*?:id", (req, res) => {
  const tableName = getTableName(req.path);
  const { id } = req.query;
  if (tableName.length > 0) {
    tableExist(tableName, (tableExistResponse) => {
      if (tableExistResponse && id) {
        let sql = `SELECT * FROM ${tableName} WHERE id = ?`;
        db.get(sql, id, (err, row) => {
          if (err) {
            res.json(err.message);
            return false;
          }
          return row
            ? res.json(row)
            : res.json(`No document found with the id ${id}`);
        });
      } else if (tableExistResponse) {
        db.serialize((err) => {
          db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
            if (err) {
              res.json(err.message);
              return false;
            }
            return res.json(rows);
          });
        });
      } else {
        res.json({
          message: "No schema exist...",
        });
      }
    });
  } else {
    res.json({
      message:
        "Opps..looks like you have not attached any schema name. Request with api/schemaName",
    });
  }
});

//Insert element to db
router.post("/*", (req, res) => {
  const tableName = getTableName(req.path);
  if (tableName.length > 0) {
    tableExist(tableName, (tableExistResponse) => {
      if (tableExistResponse) {
        const body = req.body;

        const keys = Object.keys(body);
        const values = Object.values(body);

        let insertParams = keys.map((key) => `${key}`).join(",");
        let insertValues = values.map((value) => "?").join(",");

        let sql = `INSERT INTO ${tableName} (${insertParams}) VALUES (${insertValues})`;

        db.run(sql, values, (err) => {
          if (err) {
            res.json(err.message);
            return false;
          }
          res.json({
            message: "Inserted successfully...",
            data: req.body,
          });
        });
      } else {
        res.json({
          message: "No schema exist...",
        });
      }
    });
  } else {
    res.json({
      message:
        "Opps..looks like you have not attached any schema name. Request with api/schemaName",
    });
  }
});

//update data
router.put("/*?:id", (req, res) => {
  const tableName = getTableName(req.path);

  if (tableName.length > 0) {
    tableExist(tableName, (tableExistResponse) => {
      if (tableExistResponse) {
        const { id } = req.query;
        const body = req.body;

        const keys = Object.keys(body);
        const values = Object.values(body);

        let params = keys.map((key) => `${key}=?`);

        const sql = `UPDATE ${tableName} SET ${params} WHERE id = ${id}`;

        db.run(sql, values, (err) => {
          if (err) {
            res.json(err.message);
            return false;
          }
          res.json({
            message: `Successfully updated record with id: ${id}`,
          });
        });
      } else {
        res.json({
          message: "No schema exist...",
        });
      }
    });
  } else {
    res.json({
      message:
        "Opps..looks like you have not attached any schema name. Request with api/schemaName",
    });
  }
});

//delete with query id
router.delete("/*?:id", (req, res) => {
  const tableName = getTableName(req.path);

  if (tableName.length > 0) {
    tableExist(tableName, (tableExistResponse) => {
      if (tableExistResponse) {
        const { id } = req.query;

        const sql = `DELETE FROM ${tableName} WHERE id = ?`;

        db.run(sql, id, (err) => {
          if (err) {
            res.json(err.message);
            return false;
          }
          res.json({
            message: `Successfully deleted record with id: ${id}`,
          });
        });
      } else {
        res.json({
          message: "No schema exist...",
        });
      }
    });
  } else {
    res.json({
      message:
        "Opps..looks like you have not attached any schema name. Request with api/schemaName",
    });
  }
});

//get table name
const getTableName = (urlPath) => {
  return urlPath.split("/").filter(function (el) {
    return el != "";
  });
};

// check table exist or not
const tableExist = (tableName, callback) => {
  const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
  db.get(sql, tableName, (err, row) => {
    if (err) {
      console.error(err);
      return callback(false);
    } else if (row) return callback(true);
    else return callback(false);
  });
};

module.exports = router;
