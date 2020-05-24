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
    vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
    gl_FragColor = vec4(col, 1.0);
  }
`

function main () {
  const canvas = document.getElementById('canvas')
  const webgl = new WebGL(canvas, vsSource, fsSource)
  webgl.animate()
}
