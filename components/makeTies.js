import * as THREE from 'three'
import { scale } from '../main'

// make a sample tie reinforcent with fixed width and height
export default function makeTies(beamDepth, beamWidth, clearCover) {
  let tieDia = 10 * scale
  const [clearWidth, clearHeight] = [beamWidth + tieDia, beamDepth + tieDia]

  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
  })
  const path = new THREE.CurvePath()
  console.log('tie width ', beamWidth, 'tie height', beamDepth)

  //Left vertical segment.
  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(-clearWidth / 2, -clearHeight / 2, -5),
      new THREE.Vector3(-clearWidth / 2, clearHeight / 2, -5)
    )
  )

  //Top Horizontal segment.
  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(-clearWidth / 2, clearHeight / 2, -5),
      new THREE.Vector3(clearWidth / 2, clearHeight / 2, -5)
    )
  )

  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(clearWidth / 2, clearHeight / 2, -5),
      new THREE.Vector3(clearWidth / 2, clearHeight / 2 - 0.01, -5) // small segment to force a corner
    )
  )
  //Right vertical segment.
  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(clearWidth / 2, clearHeight / 2, -5),
      new THREE.Vector3(clearWidth / 2, -clearHeight / 2, -5)
    )
  )

  //Bottom Horizontal segment.
  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(clearWidth / 2, -clearHeight / 2, -5),
      new THREE.Vector3(-clearWidth / 2, -clearHeight / 2, -5)
    )
  )

  const tubeGeometry = new THREE.TubeGeometry(path, 20, tieDia / 2, 32, false)
  const ties = new THREE.Mesh(tubeGeometry, material)

  return ties
}
