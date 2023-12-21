/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314 -- Sept 2023  -- A3 Template
/////////////////////////////////////////////////////////////////////////////////////////

console.log('Underwater Scene');

var animation = true;

var meshesLoaded = false;
var RESOURCES_LOADED = false;
var deg2rad = Math.PI/180;
// give the following global scope (within in this file), which is useful for motions and objects
// that are related to animation

  // setup animation data structure, including a call-back function to use to update the model matrix
var crabMotion = new Motion(mycrabSetMatrices); 
var sfMotion = new Motion(mysfSetMatrices);
var jellyMotion = new Motion(jellyfishSetMatrices);
var jellyMotion2 = new Motion(jellyfishSetMatrices);

var link1, link2, link3, link4, link5, link6, link7, link8, link9, link10;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5, linkFrame6, linkFrame7, linkFrame8, linkFrame9, linkFrame10;
var sphere;    
var mybox;     
var meshes = {};  

// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearColor(0x122864);     // set background colour
canvas.appendChild(renderer.domElement);


var currentAnimation;

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
      // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

    // SETUP ORBIT CONTROLS OF THE CAMERA (user control of rotation, pan, zoom)
    // const controls = new OrbitControls( camera, renderer.domElement );
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
    console.log('init called');
    initCamera();

    initLights();
    initObjects();
    initJellyfish();
    initFileObjects();

    initMotions();
    initCrabMotion();
    initSFMotion();
    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {
      // keyframes for jellyfish:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5, theta6, theta7, t8, t9, t10]
    jellyMotion.addKeyFrame(new Keyframe('straight',         0.0, [0, 2,    0, 0, 0, 0, -45, -35, -45, -60, -50, -60]));
    jellyMotion.addKeyFrame(new Keyframe('straight',         4.0, [0, 4,    0, 0, 0, 0, -30, -15, -30, -40, -30, -40]));
    jellyMotion.addKeyFrame(new Keyframe('straight',         8.0, [0, 5,    0, 0, 0, 0, -15, 0,   -15,  0,   0,   0]));
    jellyMotion.addKeyFrame(new Keyframe('straight',         10.0, [0, 5.5, 0, 0, 0, 0,  0,  0,   0,   0,   0,   0]));
    jellyMotion.addKeyFrame(new Keyframe('straight',         12.0, [0, 6,   0, 0, 0, 0,  0,  0,   0,   0,   0,   0]));
    jellyMotion.addKeyFrame(new Keyframe('straight',         14.0, [0, 5.5, 0, 0, 0, 0, -15, 0,   -15,  -20, 0,  -20]));
    jellyMotion.addKeyFrame(new Keyframe('straight',         20.0, [0, 4,   0, 0, 0, 0, -30, -15, -30, -40, -30, -40]));
    jellyMotion.addKeyFrame(new Keyframe('straight',         28.0, [0, 2,   0, 0, 0, 0, -45, -35, -45, -60, -50, -60]));

 
    jellyMotion2.addKeyFrame(new Keyframe('straight',         2.0, [2, 3,   45, 0, 0, 0,  0,  0,   0,   0,   0,   0]));
    jellyMotion2.addKeyFrame(new Keyframe('straight',         4.0, [1, 4,   45, -15, 25, 25,  -20,  35,   45,   55,   -35,   -25]));
    jellyMotion2.addKeyFrame(new Keyframe('straight',         8.0, [1, 4,   45, 0, 0, 0,  0,  0,   0,   0,   0,   0]));
    jellyMotion2.addKeyFrame(new Keyframe('straight',         12.0, [-1, 5,   45, -15, 25, 25,  -20,  35,   45,   55,   -35,   -25]));
    jellyMotion2.addKeyFrame(new Keyframe('straight',         16.0, [-1, 5,   45, 0, 0, 0,  0,  0,   0,   0,   0,   0]));
    jellyMotion2.addKeyFrame(new Keyframe('straight',         22.0, [2, 3,   45, 0, 0, 0,  0,  0,   0,   -45,   -45,   -45]));
    jellyMotion2.addKeyFrame(new Keyframe('straight',         26.0, [2, 3,   45, 0, 0, 0,  0,  0,   0,   0,   0,   0]));


    currentAnimation = jellyMotion;

}



////////////////////////////////////////////////////////////////////////
// initcrabMotion():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initCrabMotion() {
        // keyframes for the mybox animated motion:   name, time, [x, y, z, theta]

        crabMotion.addKeyFrame(new Keyframe('pose A',0.0, [-4, -1, 1,0]));
        crabMotion.addKeyFrame(new Keyframe('pose A',3.0, [-2, -1, 2,-25]));
        crabMotion.addKeyFrame(new Keyframe('pose A',6.0, [0, -1, 3,-45]));
        crabMotion.addKeyFrame(new Keyframe('pose A',10.0, [0, -1, 3,-45]));
        crabMotion.addKeyFrame(new Keyframe('pose A',12.0, [0, -1, 3,-75]));
        crabMotion.addKeyFrame(new Keyframe('pose A',14.0, [0, -1, 3,-15]));
        crabMotion.addKeyFrame(new Keyframe('pose A',16.0, [0, -1, 3,-15]));
        crabMotion.addKeyFrame(new Keyframe('pose A',18.0, [0, -1, 3,0]));
        crabMotion.addKeyFrame(new Keyframe('pose A',25.0, [-4, -1, 2,0]));
        crabMotion.addKeyFrame(new Keyframe('pose A',28.0, [-4, -1, 2,0]));
        crabMotion.addKeyFrame(new Keyframe('pose A',29.0, [-4, 0, 2,0]));
        crabMotion.addKeyFrame(new Keyframe('pose A',30.0, [-4, -1, 2,0]));
        crabMotion.addKeyFrame(new Keyframe('pose A',32.0, [-4, -1, 2,0]));
 
    
          // basic interpolation test, just printing interpolation result to the console
        crabMotion.currTime = 0.1;
        console.log('kf',crabMotion.currTime,'=',crabMotion.getAvars());    // interpolate for t=0.1
        crabMotion.currTime = 2.9;
        console.log('kf',crabMotion.currTime,'=',crabMotion.getAvars());    // interpolate for t=2.9
}

///////////////////////////////////////////////////////////////////////////////////////
// mycrabSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function mycrabSetMatrices(avars) {

     // update position of a crab
    var theta = avars[3]*deg2rad;
    meshes["crab1"].matrixAutoUpdate = false;
    meshes["crab1"].matrix.identity();
    meshes["crab1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],0));  
    meshes["crab1"].matrix.multiply(new THREE.Matrix4().makeTranslation(0,.5,0));  
    meshes["crab1"].matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI/2));  
    meshes["crab1"].matrix.multiply(new THREE.Matrix4().makeRotationZ(theta));  
    meshes["crab1"].matrix.multiply(new THREE.Matrix4().makeScale(1,1,1));
    meshes["crab1"].updateMatrixWorld();  
}

function mysfSetMatrices(avars) {

 var a = avars[3];
 meshes["starfish1"].matrixAutoUpdate = false;
 meshes["starfish1"].matrix.identity();
 meshes["starfish1"].matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0],avars[1],0));  
 meshes["starfish1"].matrix.multiply(new THREE.Matrix4().makeTranslation(8,0,3));  
 meshes["starfish1"].matrix.multiply(new THREE.Matrix4().makeScale(10,10,10));
 meshes["starfish1"].matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI));  

 meshes["starfish1"].matrix.multiply(new THREE.Matrix4().makeScale(a,a,a));  
 meshes["starfish1"].updateMatrixWorld();  
}

function initSFMotion() {

  sfMotion.addKeyFrame(new Keyframe('INITIAL',0.0, [-5, -1, 1,.8]));
  sfMotion.addKeyFrame(new Keyframe('SCALE UP',10.0, [-5, -1, 1,1]));
  sfMotion.addKeyFrame(new Keyframe('SCALE DOWN',15.0, [-5, -1, 1,1]));
  sfMotion.addKeyFrame(new Keyframe('INITIAL',20.0, [-5, -1, 1,.8]));

}
///////////////////////////////////////////////////////////////////////////////////////
// jellyfishSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function jellyfishSetMatrices(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var theta1 = avars[2]*deg2rad;
  var theta2 = avars[3]*deg2rad;
  var theta3 = avars[4]*deg2rad;
  var theta4 = avars[5]*deg2rad;
  var theta5 = avars[6]*deg2rad;
  var theta6 = avars[7]*deg2rad;
  var theta7 = avars[8]*deg2rad;
  var theta8 = avars[9]*deg2rad;
  var theta9 = avars[10]*deg2rad;
  var theta10 = avars[11]*deg2rad;
  
  var M =  new THREE.Matrix4();
  
    ////////////// link1 
  linkFrame1.matrix.identity(); 
  linkFrame1.matrix.multiply(M.makeTranslation(xPosition,yPosition,0));   
  linkFrame1.matrix.multiply(M.makeRotationZ(theta1));    
    // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  link1.matrix.copy(linkFrame1.matrix);
  link1.matrix.multiply(M.makeTranslation(0,1,0));   
  link1.matrix.multiply(M.makeScale(1,1,1));    

    ////////////// link2
  linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
  linkFrame2.matrix.multiply(M.makeTranslation(-1,.5,0));
  linkFrame2.matrix.multiply(M.makeRotationY(-Math.PI/4)); 
  linkFrame2.matrix.multiply(M.makeRotationZ(theta2));    
    // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  link2.matrix.copy(linkFrame2.matrix);
  link2.matrix.multiply(M.makeTranslation(0,0,0));   
  link2.matrix.multiply(M.makeScale(1,5,1));    

    ///////////////  link3
  linkFrame3.matrix.copy(linkFrame1.matrix);
  linkFrame3.matrix.multiply(M.makeTranslation(0,.5,.7));
  linkFrame3.matrix.multiply(M.makeRotationZ(theta3));    
    // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  link3.matrix.copy(linkFrame3.matrix);
  link3.matrix.multiply(M.makeTranslation(0,0,0));   
  link3.matrix.multiply(M.makeScale(1,5,1));    

    /////////////// link4
  linkFrame4.matrix.copy(linkFrame1.matrix);
  linkFrame4.matrix.multiply(M.makeTranslation(1,.5,0));
  linkFrame4.matrix.multiply(M.makeRotationY(Math.PI/4)); 
  linkFrame4.matrix.multiply(M.makeRotationZ(theta4));    
    // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
  link4.matrix.copy(linkFrame4.matrix);
  link4.matrix.multiply(M.makeTranslation(0,0,0));   
  link4.matrix.multiply(M.makeScale(1,5,1));    

    // link5
  linkFrame5.matrix.copy(linkFrame2.matrix);
  linkFrame5.matrix.multiply(M.makeTranslation(0,-.5,0));
  linkFrame5.matrix.multiply(M.makeRotationX(theta5));    
    // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
  link5.matrix.copy(linkFrame5.matrix);
  link5.matrix.multiply(M.makeTranslation(0,-.5,0));   
  link5.matrix.multiply(M.makeScale(1,5,1)); 
  
  // link6
  linkFrame6.matrix.copy(linkFrame3.matrix);
  linkFrame6.matrix.multiply(M.makeTranslation(0,-.5,0));
  linkFrame6.matrix.multiply(M.makeRotationX(theta6));    
   // Frame 6 has been established, now setup the extra transformations for the scaled box geometry
  link6.matrix.copy(linkFrame6.matrix);
  link6.matrix.multiply(M.makeTranslation(0,-.5,0));   
  link6.matrix.multiply(M.makeScale(1,5,1));  

  // link7
  linkFrame7.matrix.copy(linkFrame4.matrix);
  linkFrame7.matrix.multiply(M.makeTranslation(0,-.5,0));
  linkFrame7.matrix.multiply(M.makeRotationX(theta7));    
   // Frame 6 has been established, now setup the extra transformations for the scaled box geometry
  link7.matrix.copy(linkFrame7.matrix);
  link7.matrix.multiply(M.makeTranslation(0,-.5,0));   
  link7.matrix.multiply(M.makeScale(1,5,1));   

  // link8
  linkFrame8.matrix.copy(linkFrame5.matrix);
  linkFrame8.matrix.multiply(M.makeTranslation(0,-1,0));
  linkFrame8.matrix.multiply(M.makeRotationX(theta8));    
   // Frame 8 has been established, now setup the extra transformations for the scaled box geometry
  link8.matrix.copy(linkFrame8.matrix);
  link8.matrix.multiply(M.makeTranslation(0,-1,0));   
  link8.matrix.multiply(M.makeScale(1,10,1));  

  // link9
  linkFrame9.matrix.copy(linkFrame6.matrix);
  linkFrame9.matrix.multiply(M.makeTranslation(0,-1,0));
  linkFrame9.matrix.multiply(M.makeRotationX(theta9));    
   // Frame 9 has been established, now setup the extra transformations for the scaled box geometry
  link9.matrix.copy(linkFrame9.matrix);
  link9.matrix.multiply(M.makeTranslation(0,-1,0));   
  link9.matrix.multiply(M.makeScale(1,10,1)); 
  
  // link10
  linkFrame10.matrix.copy(linkFrame7.matrix);
  linkFrame10.matrix.multiply(M.makeTranslation(0,-1,0));
  linkFrame10.matrix.multiply(M.makeRotationX(theta10));    
   // Frame 10 has been established, now setup the extra transformations for the scaled box geometry
  link10.matrix.copy(linkFrame10.matrix);
  link10.matrix.multiply(M.makeTranslation(0,-1,0));   
  link10.matrix.multiply(M.makeScale(1,10,1));  
 
 


  link1.updateMatrixWorld();
  link2.updateMatrixWorld();
  link3.updateMatrixWorld();
  link4.updateMatrixWorld();
  link5.updateMatrixWorld();
  link6.updateMatrixWorld();
  link7.updateMatrixWorld();
  link8.updateMatrixWorld();
  link9.updateMatrixWorld();
  link10.updateMatrixWorld();

  linkFrame1.updateMatrixWorld();
  linkFrame2.updateMatrixWorld();
  linkFrame3.updateMatrixWorld();
  linkFrame4.updateMatrixWorld();
  linkFrame5.updateMatrixWorld();
  linkFrame6.updateMatrixWorld();
  linkFrame7.updateMatrixWorld();
  linkFrame8.updateMatrixWorld();
  linkFrame9.updateMatrixWorld();
  linkFrame10.updateMatrixWorld();
}


/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0x5a4fb0);
    light.position.set(0,4,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x93bee9);
    scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var coralMaterial = new THREE.MeshLambertMaterial( {color: 0xe4691b} );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var lightMaterial = new THREE.MeshBasicMaterial( {color: 0xa7deef} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    var worldFrame = new THREE.AxesHelper(10) ;
    //scene.add(worldFrame);

    // textured floor
    var floorTexture = new THREE.TextureLoader().load('images/sand.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.CircleGeometry(9, 32);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // sphere, located at light position
    var sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, lightMaterial);
    sphere.position.set(0,4,2);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    scene.add(sphere);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    var torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    var torus = new THREE.Mesh( torusGeometry, coralMaterial);

    torus.rotation.set(0,Math.PI/3,0);     // rotation about x,y,z axes
    torus.scale.set(1.8,2.5,3.5);
    torus.position.set(-6, 0, -.7);   // translation

    scene.add( torus );

    
    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    var torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    var torus = new THREE.Mesh( torusGeometry, coralMaterial);

    torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    torus.scale.set(0.9,1.25,1.75);
    torus.position.set(-2.5, 0, -2.2);   // translation

    scene.add( torus );

}
/////////////////////////////////////////////////////////////////////////////////////
//  initJellyfish():  define a ll geometry associated with the jellyfish
/////////////////////////////////////////////////////////////////////////////////////

function initJellyfish() {
  var jellyMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.85} );
  var jellyMaterial1 = new THREE.MeshLambertMaterial( {color: 0xa6d9fa, side: THREE.DoubleSide, transparent: true, opacity: 0.85} );
  var jellyMaterial2 = new THREE.MeshLambertMaterial( {color: 0x4aa3e3, side: THREE.DoubleSide, transparent: true, opacity: 0.85} );
  var boxGeometry = new THREE.BoxGeometry( .2, .2, .2 );    // width, height, depth
  var sphereGeometry = new THREE.SphereBufferGeometry(1.5, 12, 32, 0, 2*Math.PI, 0, 0.5 * Math.PI);

  link1 = new THREE.Mesh( sphereGeometry, jellyMaterial );  scene.add( link1 );
  linkFrame1   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame1);
  link2 = new THREE.Mesh( boxGeometry, jellyMaterial );  scene.add( link2 );
  linkFrame2   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame2);
  link3 = new THREE.Mesh( boxGeometry, jellyMaterial );  scene.add( link3 );
  linkFrame3   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame3);
  link4 = new THREE.Mesh( boxGeometry, jellyMaterial );  scene.add( link4 );
  linkFrame4   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame4);
  link5 = new THREE.Mesh( boxGeometry, jellyMaterial1 );  scene.add( link5 );
  linkFrame5   = new THREE.AxesHelper(1) ;  
  scene.add(linkFrame5);
  link6 = new THREE.Mesh( boxGeometry, jellyMaterial1 );  scene.add( link6 );
  linkFrame6   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame6);
  link7 = new THREE.Mesh( boxGeometry, jellyMaterial1 );  scene.add( link7 );
  linkFrame7   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame7);
  link8 = new THREE.Mesh( boxGeometry, jellyMaterial2 );  scene.add( link8 );
  linkFrame8   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame8);
  link9 = new THREE.Mesh( boxGeometry, jellyMaterial2 );  scene.add( link9 );
  linkFrame9   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame9);
  link10 = new THREE.Mesh( boxGeometry, jellyMaterial2 );  scene.add( link10 );
  linkFrame10   = new THREE.AxesHelper(1) ;   
  scene.add(linkFrame10);

  link1.matrixAutoUpdate = false;  
  link2.matrixAutoUpdate = false;  
  link3.matrixAutoUpdate = false;  
  link4.matrixAutoUpdate = false;  
  link5.matrixAutoUpdate = false;
  link6.matrixAutoUpdate = false;
  link7.matrixAutoUpdate = false;
  link8.matrixAutoUpdate = false;
  link9.matrixAutoUpdate = false;
  link10.matrixAutoUpdate = false;

  linkFrame1.matrixAutoUpdate = false;  
  linkFrame2.matrixAutoUpdate = false;  
  linkFrame3.matrixAutoUpdate = false;  
  linkFrame4.matrixAutoUpdate = false;  
  linkFrame5.matrixAutoUpdate = false;
  linkFrame6.matrixAutoUpdate = false;
  linkFrame7.matrixAutoUpdate = false;
  linkFrame8.matrixAutoUpdate = false;
  linkFrame9.matrixAutoUpdate = false;
  linkFrame10.matrixAutoUpdate = false;
  
}

var currentAnimation = 'jm1';

function toggleAnimation() {
  console.log('Switching animation');
    if (currentAnimation === 'jm1') {
        // Switch to the alternative animation.
        currentAnimation = 'jm2';
    } else {
        // Switch back to the original animation.
        currentAnimation = 'jm1';
    }
}

/////////////////////////////////////////////////////////////////////////////////////
//  create bubble animation that plays/kills when b is pressed
/////////////////////////////////////////////////////////////////////////////////////
// Define variables for the bubble animation
var bubble = null;
var bubbleAnimation = false;
var bubbleRadius = 0.3; // Initial bubble radius

// Function to generate a random radius for the bubble
function getRandomRadius() {
    return Math.random() * (1 - 0.3) + 0.3;
}

function getRandomPosition() {
  var x = Math.random() * 16 - 8; // Random X position between -8 and 8
  var y = -1; // Fixed initial Y position
  var z = 1; // Fixed initial Z position
  return { x, y, z };
}

// Function to create a bubble
function createBubble() {
    var radius = getRandomRadius();
    var position = getRandomPosition();
    var bubbleGeometry = new THREE.SphereGeometry(radius, 32, 32);
    var bubbleMaterial = new THREE.MeshBasicMaterial({ color: 0xa091e2, transparent: true, opacity: 0.3 });
    var bubbleMesh = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubbleMesh.position.set(position.x, position.y, position.z);
    return bubbleMesh;
}

function toggleBubbleAnimation() {
  if (bubbleAnimation) {
      stopBubbleAnimation();
  } else {
      startBubbleAnimation();
  }
}

// Function to stop the bubble animation
function stopBubbleAnimation() {
  if (bubbleAnimation && bubble) {
      scene.remove(bubble);
      bubble = null;
      bubbleAnimation = false;
  }
}
// Function to start the bubble animation
function startBubbleAnimation() {
    if (!bubbleAnimation) {
        bubble = createBubble();
        scene.add(bubble);
        bubbleAnimation = true;
    }
}

// Function to update the bubble animation
function updateBubbleAnimation() {
    if (bubbleAnimation && bubble) {
        // Move the bubble upwards
        bubble.position.y += 0.1; // You can adjust the vertical speed

        // Check if the bubble has reached the desired height
        if (bubble.position.y >= 10) {
            scene.remove(bubble);
            bubble = null; // Set bubble to null to create a new one
            bubbleAnimation = false;
            setTimeout(startBubbleAnimation, 1000); // Wait for 1 second before creating a new bubble
        }
    }
}


/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

  
// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

var models;
var seaweedMaterial = new THREE.MeshLambertMaterial( {color: 0x8ad493, side: THREE.DoubleSide } );
var crabMaterial = new THREE.MeshStandardMaterial( {color: 0xa5a5a5, side: THREE.DoubleSide } );
var shellMaterial = new THREE.MeshLambertMaterial( {color: 0xeab68e, side: THREE.DoubleSide } );
var starfishMaterial = new THREE.MeshLambertMaterial( {color: 0xe4541b, side: THREE.DoubleSide } );
function initFileObjects() {
        // list of OBJ files that we want to load, and their material
    models = {     
  seaweed:   {obj:"obj/seaweed.obj", mtl: seaweedMaterial, mesh: null},
  crab:   {obj:"obj/Crab.obj", mtl: crabMaterial, mesh: null},
  shell: {obj:"obj/shell.obj", mtl: shellMaterial, mesh: null},
  starfish: {obj:"obj/starfish.obj", mtl: starfishMaterial, mesh: null}
};


    var manager = new THREE.LoadingManager();
    manager.onLoad = function () {
	console.log("loaded all resources");
	RESOURCES_LOADED = true;
	onResourcesLoaded();
    }
    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };
    var onError = function ( xhr ) {
    };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
    for( var _key in models ){
	console.log('Key:', _key);
	(function(key){
	    var objLoader = new THREE.OBJLoader( manager );
	    objLoader.load( models[key].obj, function ( object ) {
		object.traverse( function ( child ) {
		    if ( child instanceof THREE.Mesh ) {
			child.material = models[key].mtl;
			child.material.shading = THREE.SmoothShading;
		    }	} );
		models[key].mesh = object;
	    }, onProgress, onError );
	})(_key);
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
 // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
 //                             i.e., creates references to the geometry, and not full copies ]
    meshes["seaweed1"] = models.seaweed.mesh.clone();
    meshes["seaweed2"] = models.seaweed.mesh.clone();
    meshes["crab1"] = models.crab.mesh.clone();
    meshes["shell1"] = models.shell.mesh.clone();
    meshes["starfish1"] = models.starfish.mesh.clone();


    // position the object instances and parent them to the scene, i.e., WCS
    // For static objects in your scene, it is ok to use the default postion / rotation / scale
    // to build the object-to-world transformation matrix. This is what we do below.
    //
    // Three.js builds the transformation matrix according to:  M = T*R*S,
    // where T = translation, according to position.set()
    //       R = rotation, according to rotation.set(), and which implements the following "Euler angle" rotations:
    //            R = Rx * Ry * Rz
    //       S = scale, according to scale.set()
    
      // note:  the local transformations described by the following position, rotation, and scale
      // are overwritten by the animation loop for this particular object, which directly builds the
      // dragon1-to-world transformation matrix

    meshes["seaweed1"].position.set(-6, -1, 2);
    meshes["seaweed1"].rotation.set(0,-Math.PI/2,0);
    meshes["seaweed1"].scale.set(2,2,2);
    scene.add(meshes["seaweed1"]);

    meshes["seaweed2"].position.set(5, -1, 6);
    meshes["seaweed2"].rotation.set(0,Math.PI/5,0);
    meshes["seaweed2"].scale.set(2,2,2);
    scene.add(meshes["seaweed2"]);

    meshes["crab1"].position.set(3, -1, 3);
    meshes["crab1"].rotation.set(-Math.PI/2,0,Math.PI/4);
    meshes["crab1"].scale.set(.03,.03,.03);
    scene.add(meshes["crab1"]);

    meshes["shell1"].position.set(0, -1, 0);
    meshes["shell1"].rotation.set(Math.PI/2,0,0);
    meshes["shell1"].scale.set(0.0335,0.0335,0.0335);
    scene.add(meshes["shell1"]);

    meshes["starfish1"].position.set(3, -1, 3);
    meshes["starfish1"].rotation.set(-Math.PI,Math.PI,0);
    meshes["starfish1"].scale.set(1,1,1);
    scene.add(meshes["starfish1"]);

    meshesLoaded = true;
}




///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == "W".charCodeAt()) {          // W = up
      light.position.y = Math.min(6, light.position.y + 0.3);
        // down
    } else if (keyCode == "S".charCodeAt()) {   // S = down
      light.position.y = Math.max(-3, light.position.y - 0.3);
        // left
    } else if (keyCode == "A".charCodeAt()) {   // A = left
      light.position.x = Math.max(-9, light.position.x - 0.3);
        // right
    } else if (keyCode == "D".charCodeAt()) {   // D = right
      light.position.x = Math.min(9, light.position.x + 0.3);
    } else if (keyCode == " ".charCodeAt()) {   // space
	animation = !animation; 
    } else if (keyCode == "B".charCodeAt()) {
      toggleBubbleAnimation();
    } else if (keyCode == "C".charCodeAt()) {
      if (currentAnimation === jellyMotion) {
        currentAnimation = jellyMotion2;
    } else {
        currentAnimation = jellyMotion;
    }
    }
};


///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
//    console.log('update()');
    var dt=0.02;
    if (animation && meshesLoaded) {
	// advance the motion of all the animated objects
	  crabMotion.timestep(dt);    // note: will also call mycrabSetMatrices(), provided as a callback fn during setup
    sfMotion.timestep(dt);
    //if(toggleAnimation === 'jm1'){
    currentAnimation.timestep(dt);} 
    //else if (toggleAnimation === 'jm2'){
    //jellyMotion2.timestep(dt);
    //}

    //}
    if (meshesLoaded) {
	sphere.position.set(light.position.x, light.position.y, light.position.z);
	renderer.render(scene, camera);
    }
    updateBubbleAnimation();
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop


}

init();
update();

