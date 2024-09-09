import * as THREE from 'three'
import makeGrid from './components/makeGrid'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import makeTies from './components/makeTies'
import { setupTweakpane } from './components/tweakPane'
import { BeamCreator } from './components/beamCreator'

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
scene.add(gridHelper)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------BOX GEOMETRY----------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Add controller for height and width of the beam
// add controller to select the dia of the bar
// Creating shear reinforcement bar

const material = new THREE.MeshPhongMaterial({
  color: 0x444444,
  wireframe: false,
  opacity: 0.8,
  transparent: true,
})

const beam = new BeamCreator(scene, material)

// initial beam creation
beam.createBeam(700, 250, 500)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------TWEAKPANE----------------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// to do : transfer this to a new module
const PARAMS = setupTweakpane(
  scene,
  camera,
  material,
  (newLength, newWidth, newHeight) =>
    beam.updateBeamGeometry(newLength, newWidth, newHeight)
)

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------CYLINDER GEOMETRY-----------------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// TODO: transfer this to a new module.
// let rebarExtrusion = 15
// let scaledCylinderLength = (beamLength + rebarExtrusion) * scale
// const rebarGeometry = new THREE.CylinderGeometry(
//   0.16,
//   0.16,
//   scaledCylinderLength,
//   16,
//   1,
//   false
// )
// const rebarMaterial = new THREE.MeshPhongMaterial({
//   color: 0xffaa88,
//   roughness: 1,
// })

// const rebar = new THREE.Mesh(rebarGeometry, rebarMaterial)
// rebar.rotation.x += 1.57
// rebar.position.y = -(2.5 - 0.5)
// scene.add(rebar)

// const rebar1 = new THREE.Mesh(rebarGeometry, rebarMaterial)
// rebar1.rotation.x += 1.57
// rebar1.position.y = -(2.5 - 0.5)
// rebar1.position.x = -1
// scene.add(rebar1)

// const rebar2 = new THREE.Mesh(rebarGeometry, rebarMaterial)
// rebar2.rotation.x += 1.57
// rebar2.position.y = -(2.5 - 0.5)
// rebar2.position.x = 1
// scene.add(rebar2)

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
