import * as THREE from 'three'

// Very small GOengine implementation to satisfy Starter Valley experience
export class GOengine {
  constructor(){
    this.canvas = null
    this.renderer = null
    this.scene = null
    this.camera = null
    this.player = null
    this._raf = null
    this.input = {forward:0, right:0, jump:false}
    this.velocityY = 0
  }

  async init(container){
    if (!container) throw new Error('Container not provided')
    // create renderer
    this.renderer = new THREE.WebGLRenderer({antialias:true})
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.renderer.domElement)
    this.container = container

    // scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x87ceeb)

    // camera
    this.camera = new THREE.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 0.1, 1000)
    this.camera.position.set(0,4,8)

    // ground
    const groundMat = new THREE.MeshStandardMaterial({color:0x2d6a4f})
    const groundGeo = new THREE.BoxGeometry(50,1,50)
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.position.y = -0.5
    ground.receiveShadow = true
    this.scene.add(ground)

    // simple trees (cubes)
    const trunkMat = new THREE.MeshStandardMaterial({color:0x8d6e63})
    const leafMat = new THREE.MeshStandardMaterial({color:0x1b5e20})
    for(let i=0;i<6;i++){
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.5,1,0.5), trunkMat)
      t.position.set((Math.random()-0.5)*30,0.0,(Math.random()-0.5)*30)
      this.scene.add(t)
      const leaves = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), leafMat)
      leaves.position.set(t.position.x,1.2,t.position.z)
      this.scene.add(leaves)
    }

    // player (block avatar)
    const playerMat = new THREE.MeshStandardMaterial({color:0xffcc00})
    const playerGeo = new THREE.BoxGeometry(1,1.8,1)
    this.player = new THREE.Mesh(playerGeo, playerMat)
    this.player.position.set(0,1,0)
    this.scene.add(this.player)

    // lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9)
    hemi.position.set(0,50,0)
    this.scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(5,10,2)
    this.scene.add(dir)

    // input
    this._onKey = this._onKey.bind(this)
    window.addEventListener('keydown', this._onKey)
    window.addEventListener('keyup', this._onKey)

    // resize
    this._onResize = ()=>{
      const w = container.clientWidth, h = container.clientHeight
      this.camera.aspect = w/h
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(w,h)
    }
    window.addEventListener('resize', this._onResize)

    // simple collision vars
    this.groundY = 0
  }

  _onKey(e){
    const down = e.type === 'keydown'
    if (['ArrowUp','KeyW'].includes(e.code)) this.input.forward = down?1: (this.input.forward===1?0:0)
    if (['ArrowDown','KeyS'].includes(e.code)) this.input.forward = down?-1: (this.input.forward===-1?0:0)
    if (['ArrowLeft','KeyA'].includes(e.code)) this.input.right = down?-1: (this.input.right===-1?0:0)
    if (['ArrowRight','KeyD'].includes(e.code)) this.input.right = down?1: (this.input.right===1?0:0)
    if (e.code === 'Space') this.input.jump = down
  }

  start(){
    let last = performance.now()
    const loop = (t)=>{
      const dt = Math.min(0.05, (t-last)/1000)
      last = t
      this._update(dt)
      this.renderer.render(this.scene, this.camera)
      this._raf = requestAnimationFrame(loop)
    }
    this._raf = requestAnimationFrame(loop)
  }

  _update(dt){
    // simple movement
    const speed = 5
    const forward = this.input.forward
    const right = this.input.right
    const dx = (right * speed * dt)
    const dz = (forward * speed * dt)
    this.player.position.x += dx
    this.player.position.z += dz

    // gravity
    if (this.player.position.y > 1){
      this.velocityY -= 9.8 * dt
      this.player.position.y += this.velocityY * dt
    } else {
      this.player.position.y = 1
      this.velocityY = 0
      if (this.input.jump){
        this.velocityY = 6
      }
    }

    // camera follow (third-person)
    const camOffset = new THREE.Vector3(0,4,8)
    const target = new THREE.Vector3().copy(this.player.position)
    const desired = target.clone().add(camOffset)
    this.camera.position.lerp(desired, 0.1)
    this.camera.lookAt(this.player.position)
  }

  stop(){
    if (this._raf) cancelAnimationFrame(this._raf)
    window.removeEventListener('keydown', this._onKey)
    window.removeEventListener('keyup', this._onKey)
    window.removeEventListener('resize', this._onResize)
    // dispose renderer
    try{ this.renderer.dispose() }catch(e){}
    // remove canvas
    if (this.container && this.renderer && this.renderer.domElement){
      this.container.removeChild(this.renderer.domElement)
    }
  }
}
