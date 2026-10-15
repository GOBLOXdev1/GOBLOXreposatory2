const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../goblox.db')

const db = new sqlite3.Database(dbPath, (err)=>{
  if(err) console.error('Failed to open DB', err)
  else console.log('SQLite DB open at', dbPath)
})

// initialize schema if needed
const fs = require('fs')
const schemaPath = path.join(__dirname, 'schema.sql')
if (fs.existsSync(schemaPath)){
  const schema = fs.readFileSync(schemaPath, 'utf8')
  db.exec(schema, (err)=>{
    if (err) console.error('Schema init error', err)
  })
}

module.exports = db
