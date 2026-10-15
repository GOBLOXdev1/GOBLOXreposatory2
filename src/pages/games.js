export function render(){
  return `
  <section>
    <h2>Games</h2>
    <div id="gamesList"></div>
    <div id="gameView"></div>
  </section>
  `
}

export async function mount(container){
  const list = container.querySelector('#gamesList')
  const view = container.querySelector('#gameView')
  const res = await fetch('/api/games')
  const games = await res.json()
  list.innerHTML = games.map((g, i)=>`<div class="game-card"><h3>${g.name}</h3><p>${g.description}</p><button data-play="${g.id}">Play</button></div>`).join('')

  list.querySelectorAll('button[data-play]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const game = games.find(x=>x.id===btn.dataset.play)
      view.innerHTML = `<h3>Loading ${game.name}...</h3><div id="gameCanvasContainer" style="height:480px;background:#000"></div><button id="returnBtn">Return to platform</button>`
      // lazy-load engine
      const mod = await import('../engine/GOengine.js')
      const engine = new mod.GOengine()
      try{
        await engine.init(document.getElementById('gameCanvasContainer'))
        engine.start()
      }catch(e){
        view.innerHTML = `<p>Failed to start game: ${e.message}</p>`
      }

      document.getElementById('returnBtn').addEventListener('click', ()=>{
        engine.stop()
        view.innerHTML = ''
      })
    })
  })

  // listen for navigate events from other modules
  window.addEventListener('navigate', (e)=>{
    if (e.detail && e.detail.page === 'games' && e.detail.game){
      const b = [...list.querySelectorAll('button[data-play]')].find(b=>{
        const g = games.find(x=>x.id===b.dataset.play)
        return g && g.name === e.detail.game
      })
      if (b) b.click()
    }
  })
}
