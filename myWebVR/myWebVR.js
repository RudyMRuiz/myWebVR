var gl;

function startWebVR() {
    gl = initWebGLProgram("#glcanvas");
    if(!gl){
        console.log("Error Initializing GL");
        return;
    }

    if (navigator.getVRDisplays) {

        navigator.getVRDisplays().then(function (displays) {
      
          if (displays.length > 0) {
            // We reuse this every frame to avoid generating garbage
            frameData = new VRFrameData();
      
            vrDisplay = displays[0];
      
            // We must adjust the canvas (our VRLayer source) to match the VRDisplay
            var leftEye = vrDisplay.getEyeParameters("left");
            var rightEye = vrDisplay.getEyeParameters("right");
      
            // update canvas width and height based on the eye parameters.
            // For simplicity we will render each eye at the same resolution
            layerSource.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
            layerSource.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
      
            // Code for showing an 'Enter VR' button should go here
      
          }
          else {
            // There are no VR displays connected.
          }
        } 
        ).catch(function (err) {
          // VR Displays are not accessible in this context.
          // Perhaps you are in an iframe without the allowvr attribute specified.
        });
      
      
      } else {
        // WebVR is not supported in this browser.
      }

    // Compile shaders...

    // Load textures...

    // Create geometry...

    // Save attributes and uniform locations

}

function initWebGLProgram(aname) {
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