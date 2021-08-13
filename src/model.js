'use strict'

const path = require('path')
const fs = require('fs')
const initSqlJs = require('sql.js')



let _rowsFromSqlDataObject = function (object) {
  let data = {}
  let i = 0
  let j = 0
  for (let valueArray of object.values) {
    data[i] = {}
    j = 0
    for (let column of object.columns) {
      Object.assign(data[i], { [column]: valueArray[j] })
      j++
    }
    i++
  }
  return data
}





initSqlJs.dbOpen = async function (databaseFileName) {
  let db = null
  try {
    await initSqlJs().then(function (SQL) {
      db = new SQL.Database(fs.readFileSync(databaseFileName));
      console.log(db)
    })
    return db
  } catch (error) {
    console.log("Can't open database file.", error.message)
    return null
  }
}

initSqlJs.dbClose = function (databaseHandle, databaseFileName) {
  try {
    let data = databaseHandle.export()
    let buffer = Buffer.alloc(data.length, data)
    fs.writeFileSync(databaseFileName, buffer)
    databaseHandle.close()
    return true
  } catch (error) {
    console.log("Can't close database file.", error)
    return null
  }
}

/*
  A function to create a new SQLite3 database from schema.sql.

  This function is called from main.js during initialization and that's why
  it's passed appPath. 
*/

let dbPath

module.exports.initDb = async function (appPath, callback, readCofigFileFunction) {
  dbPath = path.join(appPath, 'example.db')
  let createDb = function (dbPath) {
    // Create a database.
    initSqlJs().then(function (SQL) {
      console.log("sql.js initialized 🎉");
      const db = new SQL.Database();

      let query = fs.readFileSync(
        path.join(__dirname, 'db', 'schema.sql'), 'utf8')
      let result = db.exec(query)

      if (Object.keys(result).length === 0 &&
        typeof result.constructor === 'function' &&
        initSqlJs.dbClose(db, dbPath)) {
        console.log('Created a new database.')
      } else {
        console.log('model.initDb.createDb failed.')
      }
    });
  }
  let db = await initSqlJs.dbOpen(dbPath)
  if (db === null) {
    /* The file doesn't exist so create a new database. */
    createDb(dbPath)
    const userConfig = readCofigFileFunction()
    this.saveUser(userConfig)
  } else {
    /*
      The file is a valid sqlite3 database. This simple query will demonstrate
      whether it's in good health or not.
    */
    let query = 'SELECT count(*) as `count` FROM `sqlite_master`'
    let row = db.exec(query)
    let tableCount = parseInt(row[0].values)
    if (tableCount === 0) {
      console.log('The file is an empty SQLite3 database.')
      createDb(dbPath)
    } else {
      console.log('The database has', tableCount, 'tables.')
    }
    if (typeof callback === 'function') {
      callback()
    }
  }
}

/*
  Populates the users List.
*/
module.exports.getUsers = async function () {
  let db = await initSqlJs.dbOpen(dbPath)
  console.log("db", db)
  if (db !== null) {
    let query = 'SELECT * FROM `users` ORDER BY `user_id` DESC'
    try {
      let row = db.exec(query)
      if (row !== undefined && row.length > 0) {
        row = _rowsFromSqlDataObject(row[0])
        return row
      }
    } catch (error) {
      console.log('model.getUsers', error.message)
    } finally {
      initSqlJs.dbClose(db, dbPath)
    }
  }
}
/*
  Fetch a person's data from the database.
*/
module.exports.getUserById = async function (pid) {
  let db = await initSqlJs.dbOpen(dbPath)
  if (db !== null) {
    let query = 'SELECT * FROM `users` WHERE `user_id` IS ?'
    let statement = db.prepare(query, [pid])
    try {
      if (statement.step()) {
        let values = [statement.get()]
        let columns = statement.getColumnNames()
        return _rowsFromSqlDataObject({ values: values, columns: columns })
      } else {
        console.log('model.getUserById', 'No data found for user_id =', pid)
      }
    } catch (error) {
      console.log('model.getUserById', error.message)
    } finally {
      initSqlJs.dbClose(db, dbPath)
    }
  }
}

/*
  Delete a person's data from the database.
*/
module.exports.deleteUser = async function (pid, callback) {
  let db = await initSqlJs.dbOpen(dbPath)
  if (db !== null) {
    let query = 'DELETE FROM `users` WHERE `user_id` IS ?'
    let statement = db.prepare(query)
    try {
      if (statement.run([pid])) {
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        console.log('model.deleteUser', 'No data found for user_id =', pid)
      }
    } catch (error) {
      console.log('model.deleteUser', error.message)
    } finally {
      initSqlJs.dbClose(db, dbPath)
    }
  }
}

/*
  Insert or update a person's data in the database.
*/
module.exports.saveUser = async function (objectValues, id, callback) {
  let userId = typeof id !== 'undefined' ? id : "NULL"
  let db = await initSqlJs.dbOpen(dbPath)
  if (db !== null) {
    let query = 'INSERT OR REPLACE INTO users'
    query += ' (user_id, user_name, email)'
    query += ` VALUES (${userId}, '${objectValues.userName}', '${objectValues.email}')`
    console.log(query)
    let statement = db.prepare(query)
    try {
      if (statement.run()) {
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        console.log('model.saveUser', 'Query failed for', objectValues.values())
      }
    } catch (error) {
      console.log('model.saveUser', error.message)
    } finally {
      initSqlJs.dbClose(db, dbPath)
    }
  }

}


