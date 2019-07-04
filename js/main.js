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
// runs the script 
initGeometry();

renderer.render(scene, camera);



// ----- raycaster to inspect which sphere is hovered by the controller
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();



var material = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(generateSprite()),
    blending: THREE.AdditiveBlending
});

for (var i = 0; i < 500; i++) {
    var particle = new THREE.Sprite(material);
    initParticle(particle, i * 10);
    scene.add(particle);
}

function generateSprite() {
    var canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,.3)');
    gradient.addColorStop(0.1, 'rgba(255,255,255,.3)');
    gradient.addColorStop(0.4, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

function initParticle(particle, delay) {
    var particle = this instanceof THREE.Sprite ? this : particle;
    var delay = delay !== undefined ? delay : 0;
    particle.position.set(Math.floor(Math.random() * 200 - 100), Math.floor(Math.random() * 200 - 100), Math.floor(Math.random() * 200 - 100));
    particle.scale.x = particle.scale.y = 1 + Math.random();
}

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
            console.log('ciao');
        }

		// // calculate objects intersecting the picking ray
		// for ( var i = 0; i < intersects.length; i++ ) {

		// 	if(intersects[i].object.name.includes("Sphere")){
		// 		intersects[ i ].object.material.color.set( colors[Math.floor(Math.random()*colors.length)] );
        //     }
        
            
        //     // se intersecta l'oggetto numero n (dovrebbero essere in ordine di creazione) allora prendi info da json/js-data/hardcode
        // }
}
render();