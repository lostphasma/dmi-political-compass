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
light.position.x = light.position.y = light.position.z = 0;
scene.add(light);

// first person controls (YES!)
var clock = new THREE.Clock();
var controls = new THREE.FirstPersonControls( camera );
controls.lookSpeed = 0.1;

var redMaterial = new THREE.MeshLambertMaterial({
    emissive: 0xff0000,
    emissiveIntensity: .5,
    reflecticity: 0,
    wireframe:false,
    shininess: 0
});

// ---------------------------------------- creates spheres and push them into the spheres array
function initGeometry(e) {
    // create the external cube
    
	var path = "assets/maps/";
	var format = '.jpg';
	var urls = [
	    path + 'posx' + format, path + 'negx' + format,
	    path + 'posy' + format, path + 'negy' + format,
	    path + 'posz' + format, path + 'negz' + format
	];
	var reflectionCube = new THREE.CubeTextureLoader().load(urls);
	scene.background = reflectionCube;

    // insert red cube in origin
    var boxDimensions = .2;
    var origin = new THREE.BoxGeometry(boxDimensions, boxDimensions, boxDimensions);
    var originBox = new THREE.Mesh(origin, redMaterial);
    scene.add(originBox);

    var loader = new THREE.TextureLoader();

    // create the spheres, to add more spheres edit the data.js file
    for (i = 0; i < geometries.length; i++){     

        var texture = new THREE.TextureLoader().load( 'assets/' + geometries[i].planet_texture);
        var geometry = new THREE.SphereGeometry(geometries[i].r, 35, 35);
        var material = new THREE.MeshLambertMaterial( { map: texture } );
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
for (i = 0; i < spheres.length; i++) {

    var url = geometries[i].url;
    var linkify	= THREEx.Linkify(domEvents, spheres[i], url, false)

    var counter = i;
    (function (i) {
        var title = geometries [i].title
        var content = geometries[i].content;
        var img = geometries[i].imageName;

        domEvents.addEventListener(spheres[i], 'mouseover', function(event){
            var tooltip = document.getElementById("tooltip");
            // Add main info
            tooltip_content =  "<h1>" + title + "</h1>" + "</br>" + "<p id = 'content'>" + content + "</p>" + "<img src='assets/" + img + "'>";
            
            tooltip.innerHTML = tooltip_content

            tooltip.classList.add("summon");
        }, false)
    }).call(this,i)

    domEvents.addEventListener(spheres[i], 'mouseout', function(event){
        document.getElementById("tooltip").classList.remove("summon");
    }, false)

}


function render() {
	requestAnimationFrame( render );
    renderer.render( scene, camera );
    
    // update the camera
    controls.update(clock.getDelta());
    
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects( spheres, true );
    /*if ( intersects.length > 0 ) {
        if ( INTERSECTED == null ) {
            INTERSECTED = intersects [ 0 ].object;
            console.log(INTERSECTED)
            var newMaterial = new THREE.MeshPhongMaterial({
                
                wireframe:false,
                shininess: 0
            });
            INTERSECTED.material = newMaterial;
        }
    } else {
        if (INTERSECTED != null) {
            var newMaterial = new THREE.MeshPhongMaterial({
                
                wireframe:false,
                shininess: 0
            });
            INTERSECTED.material = newMaterial;
        }
        INTERSECTED = null;    
    }*/
    renderer.render( scene, camera );
}

render();