var cubeRotation = 0.0;
var gl;
var canvas;
var deltaX = 0;
var deltaY = 0;
var ambientVec = [0.5, 0.5, 0.5];
var sunlightColorVec = [1.0, 1.0, 1.0];
var sunlightDirVec = [0.0, 0.8, 0.8];
var flatShading = false;

//
// Start here
//
function startWebVR() {
    gl = initGLScene();
    
    initShaders();
    initGeometry();

    initTextures();

    gl.clearColor(0.4, 0.4, 0.4, 1.0);
    gl.enable(gl.DEPTH_TEST);

    frames();
  
}

// Draw the scene repeatedly
function frames() {
    requestAnimationFrame(frames);
    drawScene();
    animate();
}
function initGLScene() {
    // Initialize the WebGL Context - the gl engine for drawing things.
    gl = initWebGLContext("#glcanvas"); 
    if (!gl) // if fails simply return
    {
        return;
    }
    // succeeded in initializing WebGL system
    return gl;
}
function initWebGLContext(aname) {
    gl = null;
    canvas = document.querySelector(aname);
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch (e) {alert("FAILED TO GET CONTEXT") }

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    return gl;
}

var shaderProgram;
function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    // Look up and save location of attribute from shaderProgram
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);


    // Look up and save location of uniforms from shaderProgram
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.normalMatrix = gl.getUniformLocation(shaderProgram, "uNormalMatrix");

    shaderProgram.ambientUniform = gl.getUniformLocation(shaderProgram, "ambientLight");
    gl.uniform3fv(shaderProgram.ambientUniform, ambientVec);
    shaderProgram.sunlightColorUniform = gl.getUniformLocation(shaderProgram, "sunlightColor");
    gl.uniform3fv(shaderProgram.sunlightColorUniform, sunlightColorVec);
    shaderProgram.sunlightDirUniform = gl.getUniformLocation(shaderProgram, "sunlightDirection");
    gl.uniform3fv(shaderProgram.sunlightDirUniform, sunlightDirVec);

}
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

//
// initBuffers
//
var cubeVertexPositionBuffer;
var cubeVertexTextureCoordBuffer;
var cubeVertexNormalBuffer;
var cubeVertexIndexBuffer;

function initGeometry() {
  cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  var positions;
  if(!flatShading){
    positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];}else{
    positions = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0, -1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];}
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  cubeVertexPositionBuffer.itemSize = 3;

  // normals for the vertices, so that we can compute lighting.
  cubeVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);

  const vertexNormals = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  cubeVertexNormalBuffer.itemSize = 3;

  // texture coordinates for the faces.
  cubeVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  cubeVertexTextureCoordBuffer.itemSize = 2;

  cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  var indices;
  if(!flatShading){
    indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];}else{
  indices = [];
  for(var i = 0; i < 36; i++){
    indices = indices.concat(i);
    }
  }
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemSize = 1;

}

// load an image.
var ezTexture;

function initTextures() {
  ezTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, ezTexture);

  ezTexture.image = new Image();
  ezTexture.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, ezTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ezTexture.image);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  ezTexture.image.src = "box.png";
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}
function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

var pMatrix;
var mvMatrix;
var normalMatrix;
//
// Draw the scene.
//
function drawScene() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  
  gl.clearDepth(1.0);                 
  gl.enable(gl.DEPTH_TEST);           
  gl.depthFunc(gl.LEQUAL);            

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  pMatrix = mat4.create();

  mat4.perspective(pMatrix, (45 * Math.PI / 180), aspect, 0.1, 100.0);

  mvMatrix = mat4.create();

  mat4.translate(mvMatrix, mvMatrix, [-0.0, 0.0, -6.0]);  
  mat4.rotate(mvMatrix, mvMatrix, cubeRotation, [1, 0, 0]);
  mat4.rotate(mvMatrix, mvMatrix, cubeRotation, [0, 1, 0]);    

  normalMatrix = mat4.create();
  mat4.invert(normalMatrix, mvMatrix);
  mat4.transpose(normalMatrix, normalMatrix);


  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, ezTexture);
  gl.uniform1i(shaderProgram.uSampler, 0);

  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
  //gl.drawArrays(gl.TRIANGLES, 0, 36);
}
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.normalMatrix, false, normalMatrix);
}

var lastTime = 0;
var timeShader = false;
var i = 0;
function animate() {
    var timeNow = new Date().getTime();
    timeNow *= 0.001;
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        // here we could change variables to adjust rotations for animation
        cubeRotation += elapsed;
    }
    lastTime = timeNow;
}
