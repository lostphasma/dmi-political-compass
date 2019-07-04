console.log('ciao');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight);
scene.add(camera);
var spheres = [];

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
// $('#canvas').append(renderer.domElement);
renderer.shadowMap.type=THREE.BasicShadowMap;
ambientLight= new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
document.querySelector('#canvas').appendChild(renderer.domElement);
light = new THREE.PointLight(0xffffff, 0.8);
light.castShadow = true;
light.shadow.camera.near=0.1;
light.shadow.camera.far=25;
light.position.x = 30;
scene.add(light);

// change the order of camera rotation
camera.rotation.order = "YXZ";

// controls
var clock = new THREE.Clock();
var controls = new THREE.FirstPersonControls( camera );
controls.lookSpeed = 0.1;

var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe:false,
    shininess: 0
});

// ----- creates spheres and push them into the spheres array
function initGeometry(e) {
    for (i = 0; i < geometries.length; i++){       
        var geometry = new THREE.SphereGeometry(geometries[i].r, 35, 35);
        var sph = new THREE.Mesh(geometry, material);
        scene.add(sph);
        sph.position.x = geometries[i].x;
        sph.position.y = geometries[i].y;
        sph.position.z = geometries[i].z;
        spheres.push(sph);
    }
}
// -----  runs the script 
initGeometry();

// var geometry = new THREE.SphereGeometry( 1, 35, 35);
// var geometry2= new THREE.SphereGeometry( 1, 35, 35);
// var cube = new THREE.Mesh(geometry, material);
// var cube2 = new THREE.Mesh(geometry2, material);
// scene.add(cube);
// scene.add(cube2);
// cube.position.z = -50;
// cube2.position.z = -5;
// cube2.position.x = 3;

// spheres.push(cube);
// spheres.push(cube2);
// console.log(spheres);

renderer.render(scene, camera);

// // ----- Manage camera and light position on the scene
// var scale = .25;
// var mouseX = 0;
// var mouseY = 0;

// document.addEventListener("mousemove", function (e) {
//     mouseX = - ( e.clientX / renderer.domElement.clientWidth ) * 2 + 1;
//     mouseY = - ( e.clientY / renderer.domElement.clientHeight ) * 2 + 1;

//     camera.rotation.x = mouseY / scale;
//     camera.rotation.y = mouseX / scale;

//     var lightdist = 40;
//     light.position.x = map(e.clientX, 0, window.innerWidth, lightdist, -lightdist);
//     light.position.y = map(e.clientY, 0, window.innerWidth, -lightdist, lightdist);

//     renderer.render(scene, camera);
// }, false);

// $('#canvas').on("mousemove", function (e) {
//     camera.rotation.y = map(e.clientX, 0, window.innerWidth, 0, -360 * Math.PI / 180);
//     camera.rotation.x = map(e.clientY, 0, window.innerHeight, 0, 360 * Math.PI / 180);
//     // camera.rotation.x += Math.max(Math.min((e.clientX - mouse.x) * 0.01, cameraMoves.speed), -cameraMoves.speed);
//     // camera.rotation.y += Math.max(Math.min((mouse.y - e.clientY) * 0.01, cameraMoves.speed), -cameraMoves.speed);

//     var lightdist = 40;
//     light.position.x = map(e.clientX, 0, window.innerWidth, lightdist, -lightdist);
//     light.position.y = map(e.clientY, 0, window.innerWidth, -lightdist, lightdist);
//     renderer.render(scene, camera);
//     // requestAnimationFrame();
// }, false);

function map(s, a1, a2, b1, b2) {
    return b1 + (s - a1) * (b2 - b1) / (a2 - a1);
}


// ----- con che sfera intereseca
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function render() {
	requestAnimationFrame( render );
    renderer.render( scene, camera );
    
    var delta = clock.getDelta();
    controls.update( delta );
    
	// update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );
        
        // console.log(raycaster.intersectObject());

        var intersects = raycaster.intersectObjects( spheres, true );
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