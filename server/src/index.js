const express = require('express')
const path = require('path')
const app = express()
const config = require('./config')

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ok:true, uptime: process.uptime()})
})

app.get('/api/games', (req, res) => {
  // sample seeded catalog
  res.json([
    { id: 'starter-valley', name: 'Starter Valley', description: 'A small starter world with simple obstacles and exploration', category: 'Explore' },
    { id: 'block-city', name: 'Block City', description: 'A sample sandbox city full of blocks', category: 'Building' },
    { id: 'orbit-run', name: 'Orbit Run', description: 'A short obby with low-gravity jumps', category: 'Arcade' }
  ])
})

// serve static in production (vite build output)
if (process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../../dist')))
  app.get('*', (req,res) => res.sendFile(path.join(__dirname, '../../dist/index.html')))
}

const server = app.listen(config.port, ()=>{
  console.log(`GOBLOX server listening on ${config.port}`)
})

// graceful shutdown
process.on('SIGINT', ()=>{ console.log('shutting down'); server.close(()=>process.exit(0)) })
