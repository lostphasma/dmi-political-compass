// Scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight);
scene.add(camera);

// Memetic tribe planets
var spheres = [];

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;

var renderer = new THREE.WebGLRenderer({
	antialias: true
});

document.querySelector('#canvas').appendChild(renderer.domElement);

// add domEvents like behaviour
var domEvents = new THREEx.DomEvents(camera, renderer.domElement)

// Lighting
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.type=THREE.BasicShadowMap;
ambientLight= new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
light = new THREE.PointLight(0xffffff, 0.8);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 25;
light.position.x = light.position.y = light.position.z = 0;
scene.add(light);

// Pirst person controls
var clock = new THREE.Clock();
var controls = new THREE.FirstPersonControls( camera );
controls.lookSpeed = 0.1;
controls.movementSpeed = 20;

// Creates spheres and push them into the spheres array
function init_geometry(e) {

	// create the external cube
	var path = "assets/maps/";
	var format = '.jpg';
	var urls = [
		path + 'posx' + format, path + 'negx' + format,
		path + 'posy' + format, path + 'negy' + format,
		path + 'posz' + format, path + 'negz' + format
	];
	
	// Add the names of the box corners to the universe    
	var corner_names = ["dank", "anarchist", "left", "normie", "authoritarian", "right"]

	// Add edge texts
	var edge_positions = [[-100,0,0],[0,-100,0],[0,0,-100],[100,0,0],[0,100,0],[0,0,100]]
	for (i = 0; i < 6; i++) {
		var map = new THREE.TextureLoader().load("assets/edge_fonts/" + corner_names[i] + ".png");
		var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
		var sprite = new THREE.Sprite( material );
		sprite.scale.set(30, 15*.75, 1);
		sprite.position.set(edge_positions[i][0], edge_positions[i][1], edge_positions[i][2])
		scene.add(sprite);
	}

	var boxDimensions = .2;

	// Ellen
	var texture = new THREE.TextureLoader().load('assets/ellen.png');
	var origin = new THREE.SphereGeometry(boxDimensions, boxDimensions, boxDimensions);
	var material = new THREE.MeshLambertMaterial( { map: texture } );
	var sph = new THREE.Mesh(origin, material);
	sph.position.x = 0;
	sph.position.y = 0;
	sph.position.z = 0;
	scene.add(sph);

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

	for (i = 0; i < 6; i++) {
		// Load and add textures
		var map = new THREE.TextureLoader().load("assets/nebulas/" + corner_names[i] + "-nebula.png");
		var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
		var sprite = new THREE.Sprite( material );
		sprite.scale.set(3000, 3000*.75, 1);
		// Make sure all the combinations of coordinates are looped through
		sprite.position.set(nebula_coordinates[i][0], nebula_coordinates[i][1], nebula_coordinates[i][2]);
		scene.add(sprite);
	}

	// Create the spheres, to add more spheres edit the data.js file
	for (i = 0; i < geometries.length; i++){     

		var texture = new THREE.TextureLoader().load("assets/" + geometries[i].planet_texture);
		var geometry = new THREE.SphereGeometry(geometries[i].r, 50, 50);
		var material = new THREE.MeshLambertMaterial( { map: texture } );
		var sph = new THREE.Mesh(geometry, material);
		scene.add(sph);
		sph.position.x = geometries[i].x;
		sph.position.y = geometries[i].y;
		sph.position.z = geometries[i].z;
		spheres.push(sph);

	}
}

// Initialise the universe
init_geometry();

renderer.render(scene, camera);

function onMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

document.addEventListener( 'mousemove', onMouseMove, false );

// DOM-like behaviour
// da fare ciclo for per prendere informazioni da data.js e pusharle
for (i = 0; i < spheres.length; i++) {

	var url = geometries[i].url;
	var linkify	= THREEx.Linkify(domEvents, spheres[i], url, false)

	var counter = i;
	(function (i) {
		var title = geometries[i].title
		var content = geometries[i].content;
		var img = geometries[i].imageName;

		var corner_names = ["dank", "anarchist", "left", "normie", "authoritarian", "right"];
		var nebula_coordinates = [[-2000,0,0],[0,-2000,0],[0,0,-2000],[2000,0,0],[0,2000,0],[0,0,2000]];

		var coordinate_text = get_coordinate_text(geometries[i].x, geometries[i].y, geometries[i].z);
		var coordinates = geometries[i].x + "," + geometries[i].y + "," + geometries[i].z;

		domEvents.addEventListener(spheres[i], 'mouseover', function(event){

			// Add main info
			tooltip_content =  "<h1>" + title + "</h1>" + "</br>";
			// Add slogan
			tooltip_content += "<p class='content'>\"<em>" + content + "\"</em></p>";
			// Add characteristics
			tooltip_content += "<p class='characteristics'>" + coordinate_text + "</p>";
			// Add the planetary coordinates
			tooltip_content += "<br><div class='planet-coordinates'><p>Celestial body located at coordinates " + coordinates + "</p></div>"
			// Add image
			tooltip_content += "<img src='assets/" + img + "'>";

			// Push it to the DOM!
			var tooltip = document.getElementById("tooltip");
			tooltip.innerHTML = tooltip_content
			tooltip.classList.add("summon");

		}, false)
	}).call(this,i)

	domEvents.addEventListener(spheres[i], 'mouseout', function(event){
		document.getElementById("tooltip").classList.remove("summon");
	}, false)

}

function get_coordinate_text(x, y, z) {
	/*Takes x, y, and z coordinates and returns spans for the six
	coordinates proportionally sized*/

	var coordinates = [x, y, z];
	var corner_names = ["dank", "anarchist", "left", "normie", "authoritarian", "right"];
	var text = "";
	var c = 0;

	for (n = 0; n < 6; n++) {
		var size = coordinates[c];
		if (n <= 2) { size = size * -1 }; // convert number after first half of loop
		size = (size * 2) + 200; // make positive first (range of 0-200)
		size = size / 10; // divide to reasonable font size
		size = 2 + size; // minimum size 4

		text += "<span class='dank_size' style='font-size: " + size + ";'>" + corner_names[n] + "</span> ";

		c++;
		// Change some stuff after we've gone through half of it
		if (n == 2) {
			c = 0;
		}
	}

	return text
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