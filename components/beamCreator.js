import * as THREE from 'three'

export class BeamCreator {
  constructor(scene, material, scale = 1 / 100) {
    this.scene = scene
    this.material = material
    this.scale = scale
    this.beamWidth = 300
    this.beamHeight = 750
    this.cube = null
    this.line = null
    // this.rebars = []
  }

  createBeam(length, width, height) {
    const scaledLength = length * this.scale
    const scaledWidth = width * this.scale
    const scaledHeight = height * this.scale

    // cube geometry updation
    const geometry = new THREE.BoxGeometry(
      scaledWidth,
      scaledHeight,
      scaledLength
    )
    if (this.cube) {
      this.cube.geometry.dispose()
      this.cube.geometry = geometry
    } else {
      this.cube = new THREE.Mesh(geometry, this.material)
      this.scene.add(this.cube)
    }

    this.cube.position.y = scaledHeight / 2
    console.log(length, width, height)

    // edges
    const edges = new THREE.EdgesGeometry(geometry)
    if (this.line) {
      this.line.geometry.dispose()
      this.line.geometry = edges
    } else {
      this.line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x3f3f3f })
      )
      this.scene.add(this.line)
    }

    this.line.position.y = scaledHeight / 2
  }
  //update rebars
  // this.updateRebars(scaledLength)

  updateBeamGeometry(newLength, newWidth, newHeight) {
    this.createBeam(newLength, newWidth, newHeight)
  }
}
