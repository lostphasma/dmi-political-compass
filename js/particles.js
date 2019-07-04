// ----- Particles
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