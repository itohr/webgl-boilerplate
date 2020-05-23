export class WebGL {
  constructor (canvas, vsSource, fsSource) {
    this.vsSource = vsSource
    this.fsSource = fsSource
    this.canvas = canvas
    this.gl = canvas.getContext('webgl')
    this.shaderProgram = null
    this.buffer = null
    this.position = new Float32Array([
      -1.0, 1.0, 0.0,
      1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
    ])
    this.start = new Date()

    this.initShaderProgram()
    this.initBuffer()
  }

  initShaderProgram () {
    const vs = this.loadShader(this.gl.VERTEX_SHADER, this.vsSource)
    const fs = this.loadShader(this.gl.FRAGMENT_SHADER, this.fsSource)

    this.shaderProgram = this.gl.createProgram()

    this.gl.attachShader(this.shaderProgram, vs)
    this.gl.attachShader(this.shaderProgram, fs)
    this.gl.linkProgram(this.shaderProgram)

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.log('Shader program initialize failed: ' + this.gl.getProgramInfoLog(this.shaderProgram))
      return null
    }

    this.gl.useProgram(this.shaderProgram)
    const uResolution = this.gl.getUniformLocation(this.shaderProgram, 'u_resolution')
    this.gl.uniform2fv(uResolution, new Float32Array([this.canvas.width, this.canvas.height]))
  }

  loadShader (type, source) {
    const shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log('Shader compile failed: ' + this.gl.getShaderInfoLog(shader))
      return null
    }

    return shader
  }

  initBuffer () {
    this.buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.position, this.gl.STATIC_DRAW)
    const aPosition = this.gl.getAttribLocation(this.shaderProgram, 'a_position')
    this.gl.enableVertexAttribArray(aPosition)
    this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, 0, 0)
  }

  animate () {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    const now = new Date()
    const time = now - this.start
    const uTime = this.gl.getUniformLocation(this.shaderProgram, 'u_time')
    this.gl.uniform1f(uTime, parseFloat(time))

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.position.length / 3)
    this.gl.flush()

    window.requestAnimationFrame(() => {
      this.animate()
    })
  }
}
