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

	// Add fixed space junk
	for (i = 0; i < space_junk.length; i++) {
		var map = new THREE.TextureLoader().load("assets/space_junk/fixed/" + space_junk[i].filename);
		var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
		var sprite = new THREE.Sprite( material );
		// Set scalle
		sprite.scale.set(space_junk[i].size, space_junk[i].size*.75, 1);
		// Set position
		sprite.position.set(space_junk[i].x, space_junk[i].y, space_junk[i].z)
		scene.add(sprite);
		//console.log("adding assets/space_junk/fixed/" + space_junk[i].filename)
	}

	// Add random space junk
	for (i = 0; i < 12; i++) {

		var map = new THREE.TextureLoader().load("assets/space_junk/random/" + i + ".gif");
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

		// Size the planets on subreddit comments
		var planet_diameter = ((geometries[i].subreddit_comments / 40397013) * 100) / 5
		// Shouldn't be too small
		if (planet_diameter < 1) { planet_diameter = 1}

		var geometry = new THREE.SphereGeometry(planet_diameter, 50, 50);
		var material = new THREE.MeshLambertMaterial( { map: texture } );
		var sph = new THREE.Mesh(geometry, material);
		scene.add(sph);
		sph.position.x = geometries[i].x;
		sph.position.y = geometries[i].y;
		sph.position.z = geometries[i].z;
		spheres.push(sph);

	}

	// Labels and coordinates for the edges of the compass
	var corner_names = ["dank", "anarchist", "left", "normie", "authoritarian", "right"];
	var nebula_coordinates = [[-2000,0,0],[0,-2000,0],[0,0,-2000],[2000,0,0],[0,2000,0],[0,0,2000]];

	// Push it to the DOM!
	var tooltip = document.getElementById("tooltip");

	// Add tooltips
	for (i = 0; i < spheres.length; i++) {

		var url = geometries[i].url;
		var linkify	= THREEx.Linkify(domEvents, spheres[i], url, false)

		var counter = i;

		(function (i) {
			var title = geometries[i].title
			var content = geometries[i].content;
			var img = geometries[i].imageName;
			var coordinate_text = get_coordinate_text(geometries[i].x, geometries[i].y, geometries[i].z);
			var coordinates = geometries[i].x + "," + geometries[i].y + "," + geometries[i].z;
			var subreddits = geometries[i].subreddit
			var subreddit_count = geometries[i].subreddit_comments
			var ur_text = geometries[i].ur_text

			domEvents.addEventListener(spheres[i], 'mouseover', function(e){

				// Add main info
				tooltip_content =  "<h1>" + title + "</h1>" + "</br>";
				// Add slogan
				tooltip_content += "<p class='content'>\"<em>" + content + "\"</em></p>";
				// Add characteristics
				tooltip_content += "<hr><p class='characteristics'>" + coordinate_text + "</p>";
				// Add the planetary coordinates
				tooltip_content += "<br><div class='planet-coordinates'><p>Celestial body located at coordinates " + coordinates + "</p></div><hr>"
				// Add image
				tooltip_content += "<img src='assets/planet_textures/" + img + "'>";
				tooltip_content += "<br><div><p>Subreddit(s): " + subreddits + " (" + subreddit_count + " comments)</p></div>"
				if (ur_text.length > 0) {
					tooltip_content += "<br><div><p>Ur-text: " + ur_text + "</p></div>"
				}

				tooltip.innerHTML = tooltip_content
				tooltip.classList.add("summon");

			}, false)
		}).call(this,i)

		domEvents.addEventListener(spheres[i], 'mouseout', function(e){
			document.getElementById("tooltip").classList.remove("summon");
		}, false)
	}
}

// Initialise the universe
init_geometry();
renderer.render(scene, camera);

function mouse_move(e) {
	e.preventDefault();
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}

document.addEventListener('mousemove', mouse_move, false );

function get_coordinate_text(x, y, z) {
	/*Takes x, y, and z coordinates and returns spans for the six
	coordinates proportionally sized*/

	// Make sure the coordinates stay within the bounds
	if (x > 100) { x = 100};
	if (x < -100) { x = -100};
	if (y > 100) { y = 100};
	if (y < -100) { y = -100};
	if (z > 100) { z = 100};
	if (z < -100) { z = -100};

	var coordinates = [x, y, z];
	var corner_names = ["dank", "anarchist", "left", "normie", "authoritarian", "right"];
	var text = "";
	var c = 0;

	for (n = 0; n < 6; n++) {
		var size = coordinates[c];
		if (n <= 2) { size = size * -1 }; // convert number after first half of loop
		size = (size * 2) + 200; // make positive first (range of 0-200)
		size = size / 10; // divide to reasonable font size
		size = 1 + size; // minimum size 1
		if (size > 40){ size = 40; } // maximum size 40 

		text += "<span class='dank_size' style='font-size: " + size + ";'>" + corner_names[n] + "</span> ";

		c++;
		// Change some stuff after we've gone through half of it
		if (n == 2) {
			c = 0;
		}
	}

	return text
}

var audio
var audio_playing = false
var audio_playing_id = ""

function play_music(e) {
	/* Function to start and stop music with the dashboard buttons */
	console.log(e);
	console.log(e.target.id);

	// If there's no audio playing, simply start a new track
	if (audio_playing == false) {
		audio = new Audio("assets/music/" + e.target.id + ".mp3");
		audio.play();
		audio_playing_id = e.target.id
		document.getElementById(e.target.id).src = "assets/dashboard/music-button-play.png"; 
		audio_playing = true
	}

	// Stop the already playing track if a button is pressed
	else {
		// Pause the audio
		audio.pause();

		// Only play a new track if it's a different button
		if (audio.src.includes("assets/music/" + e.target.id + ".mp3")) {
			audio_playing = false;
			document.getElementById(e.target.id).src = "assets/dashboard/music-button-pause.png"; 
		}
		else {
			document.getElementById(audio_playing_id).src = "assets/dashboard/music-button-pause.png"; 
			audio = new Audio("assets/music/" + e.target.id + ".mp3");
			audio.play();
			audio_playing = true
			audio_playing_id = e.target.id
			document.getElementById(e.target.id).src = "assets/dashboard/music-button-play.png"; 
		}
	}
}

// Add click events to the music buttons (with pure JS...)
var music_buttons = document.getElementsByClassName("music-button");
for (var i = 0; i < music_buttons.length; i++) {
    music_buttons[i].addEventListener('click', play_music, false);
}

var old_cam_position = ""
var intersects
var dashboard = document.getElementById("dash-text");
var dash_coordinates = document.getElementById("dash-coordinates");

function render() {
	/* Function to render everything */
	requestAnimationFrame( render );	
	
	// Update the camera
	controls.update(clock.getDelta());
	
	// Update the picking ray with the camera and mouse position
	raycaster.setFromCamera(mouse, camera);
	intersects = raycaster.intersectObjects( spheres, true );
	
	// Update the pilot's navigation dashboard if the camera changed
	// Covert the camera positions to a string for easy comparison
	cam_position = camera.position
	new_cam_position = "[" + cam_position.x.toFixed(2) + "] " + "[" + cam_position.y.toFixed(2) + "] " + "[" + cam_position.z.toFixed(2) + "]"
	if (new_cam_position !== old_cam_position) {
		cam_text = get_coordinate_text(cam_position.x, cam_position.y, cam_position.z)
		dash_coordinates.innerHTML = new_cam_position
		dashboard.innerHTML = cam_text
	}
	old_cam_position = new_cam_position
	
	// Keep rendering! 
	renderer.render( scene, camera );
}

render();