export function render(){
  return `
  <section class="welcome-panel">
    <div>
      <span class="eyebrow">WELCOME TO THE NEXT BUILD</span>
      <h1>Your next adventure<br/>starts here.</h1>
      <p>Discover worlds. Build your avatar. Make something legendary.</p>
      <button class="primary-button" data-page="games">Explore games →</button>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="sun"></div>
    </div>
  </section>

  <div class="section-heading">
    <div>
      <h2>Featured experiences</h2>
      <p>Worlds waiting to be explored.</p>
    </div>
    <button class="text-button" data-page="games">View all →</button>
  </div>

  <section class="game-grid" id="gameGrid"></section>

  <section class="notice-panel">
    <div class="notice-icon">⚙</div>
    <div>
      <h3>You're using GOBLOX Preview</h3>
      <p>This is an early interface prototype. Online multiplayer, real accounts, and server-backed currency aren't connected yet.</p>
    </div>
  </section>
  `
}

export function mount(container){
  // fetch games from API
  fetch('/api/games').then(r=>r.json()).then(data=>{
    const grid = container.querySelector('#gameGrid')
    grid.innerHTML = data.map((g, i)=>`
      <article class="game-card">
        <div class="game-art art-green"><span>🌳</span><b>${String(i+1).padStart(2,'0')}</b></div>
        <div class="game-info">
          <h3>${g.name}</h3>
          <p>${g.category}</p>
          <button class="play-button" data-game="${g.name}">View experience</button>
        </div>
      </article>
    `).join('')

    grid.querySelectorAll('.play-button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const evt = new CustomEvent('navigate', {detail:{page:'games', game:btn.dataset.game}})
        window.dispatchEvent(evt)
      })
    })
  }).catch(err=>console.error(err))

  // handle quick nav from this page
  container.querySelectorAll('[data-page]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const page = btn.dataset.page
      const navEvent = new CustomEvent('navigate', {detail:{page}})
      window.dispatchEvent(navEvent)
    })
  })
}
