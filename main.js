import * as THREE from 'three'
import makeGrid from './components/makeGrid'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import makeTies from './components/makeTies'
import { Pane } from 'tweakpane'

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ---------------------------------------GLOBAL CONTROLS----------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let sceneBackgroundColor = 0xe6fffa
let scale = 1 / 100 // This means that 1 unit of Three js means 100mm
// we will use a unit of mm throughout the project.
let clearCover = 50 * scale
let [beamLength, beamWidth, beamHeight] = [700, 300, 750]

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ---------------------------------------SCENE CONTROLS------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const scene = new THREE.Scene()
scene.background = new THREE.Color(sceneBackgroundColor)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.x = 5
camera.position.y = 7.5
camera.position.z = 18

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement)

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------ORBIT CONTROLS------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const controls = new OrbitControls(camera, renderer.domElement)
console.log(controls)

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------------------LIGHT CONTROLS------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ambientLight = new THREE.AmbientLight(0x404040, 10)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
directionalLight.position.set(10, 5, 2)
scene.add(directionalLight)

// const helper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(helper)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------GRID HELPER----------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Create a plane grid
const size = 50
const divisions = 25
const gridHelper = makeGrid(size, divisions)
gridHelper.position.y = -2.5
// scene.add(gridHelper)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------BOX GEOMETRY----------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Add controller for height and width of the beam
// add controller to select the dia of the bar
// Creating shear reinforcement bar

let beamColor = 0x666666

let [scaledBeamLength, scaledBeamwidth, scaledBeamHeight] = [
  beamLength * scale,
  beamWidth * scale,
  beamHeight * scale,
]

const geometry = new THREE.BoxGeometry(
  scaledBeamwidth,
  scaledBeamHeight,
  scaledBeamLength
)
const material = new THREE.MeshPhongMaterial({
  color: beamColor,
  roughness: 1,
  metalness: 0.0,
  opacity: 0.8,
  transparent: true,
  flatShading: true,
})

material.wireframe = false
const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0
scene.add(cube)

const edges = new THREE.EdgesGeometry(geometry)
const line = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0x3f3f3f })
)

line.position.y = 0
scene.add(line)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------GUI-----------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const PARAMS = {
  bgColor: '#e6fffa',
  cameraZ: 18,
  beamColor: '#666666',
  wireframe: false,
  beamLength: 1000,
  beamHeight: 500,
  beamWidth: 250,
}

function updateBeamGeometry() {
  const scaledLength = PARAMS.beamLength * scale
  const scaledWidth = PARAMS.beamWidth * scale
  const scaledHeight = PARAMS.beamHeight * scale

  // Update cube geometry
  cube.geometry.dispose() // Dispose of old geometry
  cube.geometry = new THREE.BoxGeometry(scaledWidth, scaledHeight, scaledLength)

  // Update edges
  const newEdges = new THREE.EdgesGeometry(cube.geometry)
  line.geometry.dispose() // Dispose of old edge geometry
  line.geometry = newEdges

  // Update rebar positions
  const halfLength = scaledLength / 2
  rebar.position.z = 0
  rebar.scale.y = scaledLength / (beamLength * scale)
  rebar1.position.z = 0
  rebar1.scale.y = scaledLength / (beamLength * scale)
  rebar2.position.z = 0
  rebar2.scale.y = scaledLength / (beamLength * scale)
}

const pane = new Pane()

pane.addBinding(PARAMS, 'bgColor').on('change', (event) => {
  scene.background = new THREE.Color(event.value)
})

pane
  .addBinding(PARAMS, 'cameraZ', {
    min: 10,
    max: 30,
    step: 0.1,
  })
  .on('change', (event) => {
    camera.position.z = event.value
  })

pane.addBinding(PARAMS, 'beamColor').on('change', (event) => {
  material.color.setStyle(event.value)
})

pane.addBinding(PARAMS, 'wireframe').on('change', (event) => {
  material.wireframe = event.value
})

pane
  .addBinding(PARAMS, 'beamLength', {
    min: 500,
    max: 5000,
    step: 10,
  })
  .on('change', () => {
    updateBeamGeometry()
  })

pane
  .addBinding(PARAMS, 'beamWidth', {
    min: 100,
    max: 1500,
    step: 10,
  })
  .on('change', () => {
    updateBeamGeometry()
  })

pane
  .addBinding(PARAMS, 'beamHeight', {
    min: 100,
    max: 1500,
    step: 10,
  })
  .on('change', () => {
    updateBeamGeometry()
  })

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------CYLINDER GEOMETRY-----------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let rebarExtrusion = 15
let scaledCylinderLength = (beamLength + rebarExtrusion) * scale
const rebarGeometry = new THREE.CylinderGeometry(
  0.16,
  0.16,
  scaledCylinderLength,
  16,
  1,
  false
)
const rebarMaterial = new THREE.MeshPhongMaterial({
  color: 0xffaa88,
  roughness: 1,
  metalness: 0.0,
  opacity: 0.5,
  transparent: false,
  flatShading: true,
})
const rebar = new THREE.Mesh(rebarGeometry, rebarMaterial)
rebar.rotation.x += 1.57
rebar.position.y = -(2.5 - 0.5)
scene.add(rebar)

const rebar1 = new THREE.Mesh(rebarGeometry, rebarMaterial)
rebar1.rotation.x += 1.57
rebar1.position.y = -(2.5 - 0.5)
rebar1.position.x = -1
scene.add(rebar1)

const rebar2 = new THREE.Mesh(rebarGeometry, rebarMaterial)
rebar2.rotation.x += 1.57
rebar2.position.y = -(2.5 - 0.5)
rebar2.position.x = 1
scene.add(rebar2)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//--------------------------------------------TIES ------------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const ties = makeTies(scaledBeamHeight, scaledBeamwidth, clearCover)
// scene.add(ties)
// console.log(ties)

//++++++++++++++++++++++++++
//--------------------------
//++++++++++++++++++++++++++

function animate() {
  //   cube.rotation.x += 0.01
  //   cube.rotation.z += 0.01

  //   line.rotation.x += 0.01
  //   line.rotation.z += 0.01
  //   const time = -performance.now() * 0.0003

  //   camera.position.x = 10 * Math.cos(time)
  //   camera.position.z = 10 * Math.sin(time)

  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

animate()

export { scale }
