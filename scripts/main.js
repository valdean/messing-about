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
	r: 0.5,
	pcount: 200,
	pcolor: "rgba(255, 255, 0, .8)",
	bcolor: "rgba(0, 0, 0, 1)",
	bounce: 0.6,
	speed: 0.2
};

var particles = [];

for(var i = 0; i < obj.pcount; i++) {
	particles[i] = new Particle();
}

var particlecount = gui.add(obj,'pcount',0,3000,1).name('particle count');
gui.add(obj,'r',0,10).name('particle radius');
gui.add(obj,'speed',-0.1,1,.1).name('gravity');
gui.add(obj,'bounce',0,1,.1).name('weight');
gui.addColor(obj,'pcolor').name('particle color');
gui.addColor(obj,'bcolor').name('background');

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

function paintCanvas() {
	ctx.fillStyle = obj.bcolor;
	ctx.fillRect(0, 0, w, h);
}

function draw() {
	paintCanvas();

	particlecount.onChange(function(n) {
		var length = particles.length;
		if (n > length) {
			for(var i = length; i < n; i++) {
				particles[i] = new Particle();
			}
		} else {
			for (var i = 0; i < length - n; i++) {
				particles.pop();
			}
		}
	});
	
	//Draw particles
	for(var j = 0; j < particles.length; j++) {
		var p = particles[j];
		p.draw();

		p.y += p.vy;
		p.x += p.vx;
		
		//Acceleration in acrion
		p.vy += obj.speed;
		
		//Detect collision with floor
		if(p.y > h) {
			p.y = h - p.radius;
			p.vy *= -1 + obj.bounce;
			p.hits++;
		}
		
		//Detect collision with walls
		if(p.x > w) {
			p.x = w - p.radius;
			p.vx *= -1 + obj.bounce;
		}
		
		else if(p.x < 0) {
			p.x = 0 + p.radius;
			p.vx *= -1 + obj.bounce;
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
