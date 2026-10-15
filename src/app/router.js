export function mountApp(root) {
  root.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="GOBLOX home">
      <span class="brand-icon">G</span>
      <span>GO<span class="brand-light">BLOX</span></span>
      <span class="preview-tag">PREVIEW</span>
    </a>

    <nav class="main-nav" aria-label="Main navigation">
      <button class="nav-button active" data-page="home">Home</button>
      <button class="nav-button" data-page="games">Games</button>
      <button class="nav-button" data-page="avatar">Avatar</button>
      <button class="nav-button" data-page="shop">Shop</button>
    </nav>

    <div class="account-area">
      <span class="currency">◈ <span id="credits">100</span></span>
      <button class="login-button" id="accountButton">Guest</button>
    </div>
  </header>

  <main class="layout">
    <aside class="sidebar">
      <p class="sidebar-label">PLATFORM</p>
      <button class="side-link selected" data-page="home">⌂ <span>Home</span></button>
      <button class="side-link" data-page="games">▦ <span>Discover games</span></button>
      <button class="side-link" data-page="avatar">♟ <span>Avatar workshop</span></button>
      <button class="side-link" data-page="shop">◈ <span>GOcredits shop</span></button>

      <div class="sidebar-footer">
        <span class="status-dot"></span>
        Preview build
        <p>GOBLOX platform concept</p>
      </div>
    </aside>

    <section class="content" id="pageContent" aria-live="polite"></section>
  </main>

  <footer class="footer">
    <span>GOBLOX Preview</span>
    <span>Built for the next generation of worlds.</span>
  </footer>
  `

  const rootContent = root.querySelector('#pageContent')

  async function navigateTo(page, opts){
    let mod
    try {
      mod = await import(`./pages/${page}.js`)
    } catch (e) {
      console.error('Page load failed', e)
      rootContent.innerHTML = '<p>Page not found</p>'
      return
    }
    rootContent.innerHTML = mod.render()
    if (mod.mount) mod.mount(rootContent, opts)

    // update active nav
    document.querySelectorAll('.nav-button, .side-link').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === page)
      btn.classList.toggle('selected', btn.dataset.page === page)
    })
  }

  // wire navigation
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = e.currentTarget.dataset.page
      navigateTo(page)
    })
  })

  // global navigate event
  window.addEventListener('navigate', (e)=>{
    if (e.detail && e.detail.page) navigateTo(e.detail.page, e.detail)
  })

  // initial page
  navigateTo('home')
}
