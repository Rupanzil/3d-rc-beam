import * as THREE from 'three'
import makeGrid from './components/makeGrid'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import makeTies from './components/makeTies'

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ---------------------------------------GLOBAL CONTROLS----------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let sceneBackgroundColor = 0xe6fffa
let scale = 1 / 100 // This means that 1 unit of Three js means 100mm
// we will use a unit of mm throughout the project.
let clearCover = 50 * scale

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

camera.position.x = 3.45
camera.position.y = 3.75
camera.position.z = 10

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
scene.add(gridHelper)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------BOX GEOMETRY----------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Add controller for height and width of the beam
// add controller to select the dia of the bar
// Creating shear reinforcement bar

let [beamLength, beamWidth, beamHeight] = [825, 250, 500]
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

const ties = makeTies(scaledBeamHeight, scaledBeamwidth, clearCover)
scene.add(ties)
console.log(ties)

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

export { scale }
