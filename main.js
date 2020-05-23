import { WebGL } from './webgl.js'

window.addEventListener('load', main)

const vsSource = `
  attribute vec3 a_position;

  void main() {
    gl_Position = vec4(a_position, 1.0);
  }
`

const fsSource = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_time;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    gl_FragColor = vec4(
      0.3 + 0.7 * (sin(uv.x + u_time / 1000.0) + 1.0) / 2.0,
      0.0,
      0.3 + 0.7 * (cos(uv.y + u_time / 500.0) + 1.0) / 2.0,
      1.0);
  }
`

function main () {
  const canvas = document.getElementById('canvas')
  const webgl = new WebGL(canvas, vsSource, fsSource)
  webgl.animate()
}
