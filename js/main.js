console.log('ciao');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
scene.add(camera);

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
// $('#canvas').append(renderer.domElement);
document.querySelector('#canvas').appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry( 1, 35, 35);
var material = new THREE.MeshBasicMaterial({
    color: 0xff0000
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.z = -50;
cube.rotation.x = 10;
cube.rotation.y = 5;
renderer.render(scene, camera);

var mouse = {x:0,y:0};
var cameraMoves = {x:0,y:0,z:-0.1,move:false,speed:0.2};

// const controls = new THREE.FirstPersonControls( camera );
// controls.lookSpeed = 0.1;

$('#canvas').on("mousemove", function (e) {

    camera.rotation.y = map(e.clientX, 0, window.innerWidth, 0, -360 * Math.PI / 180);
    camera.rotation.x = map(e.clientY, 0, window.innerHeight, 0, 360 * Math.PI / 180);
    // camera.rotation.x += Math.max(Math.min((e.clientX - mouse.x) * 0.01, cameraMoves.speed), -cameraMoves.speed);
    // camera.rotation.y += Math.max(Math.min((mouse.y - e.clientY) * 0.01, cameraMoves.speed), -cameraMoves.speed);

    renderer.render(scene, camera);
    // requestAnimationFrame();
})

function map(s, a1, a2, b1, b2) {
    return b1 + (s - a1) * (b2 - b1) / (a2 - a1);
}


// ----- con che sfera intereseca
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );

    
	// update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );
        
        var intersects = raycaster.intersectObjects( scene.children, true );
        if(intersects.length > 0) {
            console.log("ciao");
        }

		// calculate objects intersecting the picking ray
		for ( var i = 0; i < intersects.length; i++ ) {

			if(intersects[i].object.name.includes("Cube") || intersects[i].object.name.includes("FRAME")){
				intersects[ i ].object.material.color.set( colors[Math.floor(Math.random()*colors.length)] );
            }
            
            // se intersecta l'oggetto numero n (dovrebbero essere in ordine di creazione) allora prendi info da json/js-data/hardcode
		}
}
render();