var gui = new dat.GUI();

// Apart from the dat.GUI additions, this code comes from Kushagra Agarwal's "Particles Gravity Effect" http://cssdeck.com/labs/particles-gravity-effect

var canvas;
var ctx;

function init(){
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	canvas.width = w;
	canvas.height = h;
	animloop();
}

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     ||  
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();


var w = window.innerWidth,
h = window.innerHeight;

var obj = {
	r: 0.75,
	pcount: 1000,
	pcolor: "rgba(255, 255, 0, .8)",
	bcolor: "rgba(0, 0, 0, 1)",
	bounce: -0.4
};

gui.add(obj,'pcount',100,5000).name('particle count');
gui.add(obj,'r',0,10).name('particle radius');
gui.addColor(obj,'pcolor').name('particle color');
gui.addColor(obj,'bcolor').name('background');
gui.add(obj,'bounce',-1,0,.1).name('gravity');

var particles = [],
		count = obj.pcount,
		acc = 0.2;

function Particle() {
	this.x = Math.random() * w;
	this.y = Math.random() * (h/1.5);
	
	this.vy = Math.random() * 2;
	this.vx = -1 + Math.random() * 2;
	
	this.color = obj.pcolor;
	this.radius = obj.r;
	this.hits = 0;
	
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		ctx.closePath();
		ctx.fill();
	};
}

//Fill the insects into flock
for(var i = 0; i < obj.pcount; i++) {
	particles.push(new Particle());
}

function paintCanvas() {
	ctx.fillStyle = obj.bcolor;
	ctx.fillRect(0, 0, w, h);
}

function draw() {
	paintCanvas();
	
	//Draw particles
	for(var j = 0; j < particles.length; j++) {
		var p = particles[j];
		p.draw();

		p.y += p.vy;
		p.x += p.vx;
		
		//Acceleration in acrion
		p.vy += acc;
		
		//Detect collision with floor
		if(p.y > h) {
			p.y = h - p.radius;
			p.vy *= obj.bounce;
			p.hits++;
		}
		
		//Detect collision with walls
		if(p.x > w) {
			p.x = w - p.radius;
			p.vx *= obj.bounce;
		}
		
		else if(p.x < 0) {
			p.x = 0 + p.radius;
			p.vx *= obj.bounce;
		}
		
		//Regenerate particles
		if(p.hits > 4) {
			//console.log("hits = " + p.hits);
			particles[j] = new Particle()
		}
	}	
}

// Start the main animation loop using requestAnimFrame
function animloop() {
	draw();
	requestAnimFrame(animloop);
}
