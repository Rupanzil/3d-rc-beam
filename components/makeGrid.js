import * as THREE from 'three'

export default function makeGrid(size, divisions) {
  const gridHelper = new THREE.GridHelper(size, divisions)
  return gridHelper
}
