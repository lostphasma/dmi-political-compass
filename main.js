console.log("mainjs loaded");
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 8000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('canvas-container').appendChild( renderer.domElement );
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
window.addEventListener( 'resize', onWindowResize, false );

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var colors = ["#E817FF", "#D89500",  "#2ECDC1", "#A3A2A2",  "#FFEC00", "#0DFF2F", "#C90090", "#0400B5",
 "#FF0000", "#FFD7D7", "#8E8E8E", "#85FFD0", "#8CB3ED", "#FFFF00", "#7F28BC", "#FF6600", "#AC3D2F", "#246319",
 "#FF83C4", "#585656", "#0000FF", "#F4F4F4", "#11E000", "#000068" ];

camera.position.z= 0;
// camera.scale.set(-1,1,1);
camera.rotation.y 	= -Math.PI/2;
var clock = new THREE.Clock();

var controls = new THREE.FirstPersonControls( camera );
controls.lookSpeed = 0.1;

var mobileControls = new THREE.DeviceOrientationControls( camera );
var isMobile;


/// TOUCH EVENTS \\\
// document.addEventListener('touchstart', function(e){
//   mouseX = ( e.touches[0].clientX - windowHalfX ) / 2;
//   mouseY = ( e.touches[0].clientY - windowHalfY ) / 2;
// }, false);
// document.addEventListener('touchmove', function(e){
//   e.preventDefault();
//   mouseX = ( e.touches[0].clientX - windowHalfX ) / 2;
//   mouseY = ( e.touches[0].clientY - windowHalfY ) / 2;
// }, false);
// document.body.addEventListener('touchend', function(e){
//   if (e.touches && e.touches[0]) {
//     mouseX = ( e.touches[0].clientX - windowHalfX ) / 2;
//     mouseY = ( e.touches[0].clientY - windowHalfY ) / 2;
//   }
// }, false);

init();

function init() {


  if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
	    // setup real compass thing, with event.alpha
	    isMobile = true;
	} else {
	    // setup some mouse following hack
	    isMobile = false;
	}

	// CUBEMAP
	var path = "cubemaps/low2/";
  var format = '.jpg';
  var urls = [
      path + 'posx' + format, path + 'negx' + format,
      path + 'posy' + format, path + 'negy' + format,
      path + 'posz' + format, path + 'negz' + format
    ];
  var reflectionCube = new THREE.CubeTextureLoader().load( urls );
  scene.background = reflectionCube;
}

// texture
var manager = new THREE.LoadingManager();
var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
	}
};
var onError = function ( xhr ) {};

var textMat = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:false, side:THREE.DoubleSide  } )

// model
var loader = new THREE.OBJLoader( manager );
loader.load( 'obj/giungla.obj', function ( object ) {

	object.traverse( function ( child ) {

		var mat = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } )
		mat.color = new THREE.Color( colors[Math.floor(Math.random()*colors.length)]);

		if ( child instanceof THREE.Mesh ) {
			if(child.name.includes("Cube") || child.name.includes("FRAME")){
			  child.material= mat;
			}
			else {
				child.material = textMat;
			}
		}
	} );

	object.position.y = 0;
	object.scale.set(-1,1,1);
	scene.add( object );

}, onProgress, onError );

function onWindowResize() {
windowHalfX = window.innerWidth / 2;
windowHalfY = window.innerHeight / 2;
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
mouseX = ( event.clientX - windowHalfX ) / 2;
mouseY = ( event.clientY - windowHalfY ) / 2;

mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var material = new THREE.SpriteMaterial( {
					map: new THREE.CanvasTexture( generateSprite() ),
					blending: THREE.AdditiveBlending
				} );
for ( var i = 0; i < 500; i++ ) {
	var particle = new THREE.Sprite( material );
	initParticle( particle, i * 10 );
	scene.add( particle );
}

function generateSprite() {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 16;
    canvas.height = 16;
    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
    gradient.addColorStop( 0.1, 'rgba(255,255,255,1)' );
    gradient.addColorStop( 0.4, 'rgba(0,0,0,1)' );
    gradient.addColorStop( 0.5, 'rgba(0,0,0,1)' );
    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );
    return canvas;
  }
  function initParticle( particle, delay ) {
    var particle = this instanceof THREE.Sprite ? this : particle;
    var delay = delay !== undefined ? delay : 0;
    particle.position.set( Math.floor(Math.random()*200-100), Math.floor(Math.random()*200-100), Math.floor(Math.random()*200-100) );
    particle.scale.x = particle.scale.y = 1 + Math.random();
  }

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );

	var delta = clock.getDelta();

    if(isMobile){
    	mobileControls.update();
    }
  	else {
  		controls.update( delta );
    }

	// update the picking ray with the camera and mouse position
		raycaster.setFromCamera( mouse, camera );

		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( scene.children, true );
		for ( var i = 0; i < intersects.length; i++ ) {

			if(intersects[i].object.name.includes("Cube") || intersects[i].object.name.includes("FRAME")){
				intersects[ i ].object.material.color.set( colors[Math.floor(Math.random()*colors.length)] );
			}
		}

	camera.position.x +=   Math.sin(clock.elapsedTime*0.1)*0.01;
	camera.position.z +=   Math.cos(clock.elapsedTime*0.1)*0.01;
	camera.position.y +=   Math.cos(clock.elapsedTime*0.1)*0.01;
}
render();

