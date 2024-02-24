const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

app.use(express.json())
const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

const intializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error:${e.message}`)
    process.exit(1)
  }
}
intializeDatabaseAndServer()

app.get('/players/', async (request, response) => {
  try {
    const getplayersquery = `
  SELECT 
    *
  FROM 
    cricket_team
  ORDER BY player_id;`
    const playersArray = await db.all(getplayersquery)
    response.send(playersArray)
  } catch (e) {
    console.log(e.message)
  }
})

//Addplayer
app.post('/players/', async (request, response) => {
  try {
    const playersDetails = request.body
    const {playerName, jerseyNumber, role} = playersDetails

    const addPlayerQuery = `INSERT INTO 
    cricket_team 
      (player_name,jersey_number,role)
    VALUES 
      (${playerName}, ${jerseyNumber}, ${role});`

    const dbResponse = await db.run(addPlayerQuery)
    const playerId = dbResponse.lastID
    response.send(playerId)
  } catch (e) {
    console.log(`${e.message}`)
  }
})

//Updateplayer
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body

  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET 
    player_name=${playerName},
    jersey_number= ${jerseyNumber},
    role=${role}
   WHERE 
    player_id= ${playerId};`

  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})
