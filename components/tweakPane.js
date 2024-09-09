import { Pane } from 'tweakpane'

export function setupTweakpane(scene, camera, material, updateBeamGeometry) {
  const PARAMS = {
    bgColor: '#e6fffa',
    cameraZ: 18,
    beamColor: '#666666',
    wireframe: false,
    beamLength: 700,
    beamWidth: 250,
    beamHeight: 500,
    opacity: 0.8,
  }

  const pane = new Pane()

  pane.addBinding(PARAMS, 'bgColor').on('change', (event) => {
    scene.background.setStyle(event.value)
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

  pane
    .addBinding(PARAMS, 'beamLength', {
      min: 100,
      max: 5000,
      step: 10,
    })
    .on('change', () => {
      updateBeamGeometry(PARAMS.beamLength, PARAMS.beamWidth, PARAMS.beamHeight)
    })

  pane
    .addBinding(PARAMS, 'beamWidth', {
      min: 100,
      max: 1000,
      step: 1,
    })
    .on('change', () => {
      updateBeamGeometry(PARAMS.beamLength, PARAMS.beamWidth, PARAMS.beamHeight)
    })

  pane
    .addBinding(PARAMS, 'beamHeight', {
      min: 100,
      max: 1000,
      step: 1,
    })
    .on('change', () => {
      updateBeamGeometry(PARAMS.beamLength, PARAMS.beamWidth, PARAMS.beamHeight)
    })

  pane
    .addBinding(PARAMS, 'opacity', {
      min: 0,
      max: 1,
      step: 0.01,
    })
    .on('change', (event) => {
      material.opacity = event.value
    })

  return PARAMS
}
