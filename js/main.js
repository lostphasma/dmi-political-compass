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

    // insert red cube in origin
	var reflectionCube = new THREE.CubeTextureLoader().load(urls);
	scene.background = reflectionCube;
    var boxDimensions = .2;
    var origin = new THREE.BoxGeometry(boxDimensions, boxDimensions, boxDimensions);
    var originBox = new THREE.Mesh(origin, redMaterial);
    scene.add(originBox);

    var loader = new THREE.TextureLoader();

    // Add random gifs in the universe
    for (i = 0; i < 12; i++) {

        var map = new THREE.TextureLoader().load("assets/space_img/" + i + ".gif");
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        var sprite = new THREE.Sprite( material );

        max = 100
        min = -100

        x = Math.floor(Math.random() * (+max - +min) + +min) * 5;
        y = Math.floor(Math.random() * (+max - +min) + +min) * 5;
        z = Math.floor(Math.random() * (+max - +min) + +min) * 5;
        
        sprite.scale.set(50, 50*.75, 1);
        
        sprite.position.set(x, y, z)
        scene.add(sprite);
    }

    // Add nebula images per corner
    var nebula_coordinates = [[-2000,0,0],[0,-2000,0],[0,0,-2000],[2000,0,0],[0,2000,0],[0,0,2000]]

    for (i = 0; i < 5; i++) {

        var map = new THREE.TextureLoader().load("assets/nebulas/" + (i + 1) + ".png");
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        var sprite = new THREE.Sprite( material );
        
        sprite.scale.set(3000, 3000*.75, 1);
        
        sprite.position.set(nebula_coordinates[i][0], nebula_coordinates[i][1], nebula_coordinates[i][2]);

        // Make sure all the combinations of coordinates are looped through

        scene.add(sprite);
    }

    // create the spheres, to add more spheres edit the data.js file
    for (i = 0; i < geometries.length; i++){     

        var texture = new THREE.TextureLoader().load('assets/' + geometries[i].planet_texture);
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
        var title = geometries[i].title
        var content = geometries[i].content;
        var img = geometries[i].imageName;

        domEvents.addEventListener(spheres[i], 'mouseover', function(event){
            var tooltip = document.getElementById("tooltip");

            // Add main info
            tooltip_content =  "<h1>" + title + "</h1>" + "</br>" + content + "<img src='assets/" + img + "'>";

            // Add the planetary coordinates
            coordinates = geometries[i].x + "," + geometries[i].y + "," + geometries[i].z
            tooltip_content += "<div class='planet-coordinates'><p>Celestial body located at coordinates " + coordinates + "</p></div>"

            // Push it to the DOM!
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

    renderer.render( scene, camera );
}

render();