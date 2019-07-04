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

// ---------------------------------------- dom like behaviour
// da fare ciclo for per prendere informazioni da data.js e pusharle
var linkify	= THREEx.Linkify(domEvents, spheres[1], "https://www.youtube.com", false)
// all'hover fare apparire tooltip con informazioni da datajs
domEvents.addEventListener(spheres[0], 'mouseover', function(event){
    document.getElementById("tooltip").classList.add("summon");
}, false)
domEvents.addEventListener(spheres[0], 'mouseout', function(event){
    document.getElementById("tooltip").classList.remove("summon");
}, false)

function render() {
	requestAnimationFrame( render );
    renderer.render( scene, camera );
    
    // update della camera
    controls.update(clock.getDelta());
    
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects( spheres, true );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED == null ) {
            INTERSECTED = intersects [ 0 ].object;
            var newMaterial = new THREE.MeshPhongMaterial({
                color: 0xff0000,
                wireframe:false,
                shininess: 0
            });
            INTERSECTED.material = newMaterial;
        }
    } else {
        if (INTERSECTED != null) {
            var newMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                wireframe:false,
                shininess: 0
            });
            INTERSECTED.material = newMaterial;
        }
        INTERSECTED = null;    
    }
    renderer.render( scene, camera );
}

render();