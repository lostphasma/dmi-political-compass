var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight);
scene.add(camera);
var spheres = [];

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
// $('#canvas').append(renderer.domElement);
renderer.shadowMap.type=THREE.BasicShadowMap;
ambientLight= new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

document.querySelector('#canvas').appendChild(renderer.domElement);

// add domEvents like behaviour
var domEvents = new THREEx.DomEvents(camera, renderer.domElement)

// lights management
light = new THREE.PointLight(0xffffff, 0.8);
light.castShadow = true;
light.shadow.camera.near=0.1;
light.shadow.camera.far=25;
light.position.x = 30;
scene.add(light);

// first person controls (YES!)
var clock = new THREE.Clock();
var controls = new THREE.FirstPersonControls( camera );
controls.lookSpeed = 0.2;

// matte white material for the spheres
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe:false,
    shininess: 0
});

// ---------------------------------------- creates spheres and push them into the spheres array
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
initGeometry();

renderer.render(scene, camera);

function onMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

document.addEventListener( 'mousemove', onMouseMove, false );

// // ---------------------------------------- dom like behaviour
// // da fare ciclo for per prendere informazioni da data.js e pusharle
// var linkify	= THREEx.Linkify(domEvents, spheres[0], "https://www.youtube.com", true)
// // all'hover fare apparire tooltip con informazioni da datajs
// domEvents.addEventListener(spheres[0], 'mouseover', function(event){
//     // tutte cose
// }, false)

function render() {
	requestAnimationFrame( render );
    renderer.render( scene, camera );
    
    // update della camera
    controls.update(clock.getDelta());
    
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects( spheres, true );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            INTERSECTED = intersects [ 0 ];
            var newMaterial = new THREE.MeshPhongMaterial({
                color: 0xffff,
                wireframe:false,
                shininess: 0
            });
            INTERSECTED.object.material = newMaterial;
        }
    } else {
        if ( INTERSECTED ) INTERSECTED.object.material = material;
        INTERSECTED = null;    
    }
    renderer.render( scene, camera );


    // renderer.render(scene, camera);

		// // calculate objects intersecting the picking ray
		// for ( var i = 0; i < intersects.length; i++ ) {

		// 	if(intersects[i].object.name.includes("Sphere")){
		// 		intersects[ i ].object.material.color.set( colors[Math.floor(Math.random()*colors.length)] );
        //     }
        
            
        //     // se intersecta l'oggetto numero n (dovrebbero essere in ordine di creazione) allora prendi info da json/js-data/hardcode
        // }
}

render();