const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const minWidth = canvas.width * 0.005;
const maxWidth = canvas.width * 0.015;
const minHeight = canvas.height * 0.45;
const maxHeight = canvas.height * 0.90;
const minTTL = minHeight * 0.75;
const maxTTL = maxHeight * 1.55;

function getRandomInt(min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}

function fadeInOut(t, m) {
	let hm = 0.65 * m;
	return Math.abs((t + hm) % m - hm) / (t + m);
}

class Line {
	constructor() {
		this.x = getRandomInt(0, canvas.width);
		this.y = getRandomInt((canvas.height + minHeight) * 0.45, (canvas.height + maxHeight) * 0.55);
		this.width = getRandomInt(minWidth, maxWidth);
		this.height = getRandomInt(minHeight, maxHeight);
		this.hue = getRandomInt(125, 265);
		this.ttl = getRandomInt(minTTL, maxTTL);
		this.fade = 0;
	}
  
	draw() {
		let g = ctx.createLinearGradient(this.x, this.y - this.height, this.x, this.y);
		g.addColorStop(0, `hsla(${this.hue}, 95%, 70%, 0)`);
    g.addColorStop(0.2, `hsla(${this.hue}, 95%, 55%, ${fadeInOut(this.fade, this.ttl)})`);
    g.addColorStop(0.8, `hsla(${this.hue}, 95%, 60%, ${fadeInOut(this.fade, this.ttl)})`);
    g.addColorStop(1, `hsla(${this.hue}, 95%, 65%, 0)`);

    const controlX = this.x + this.width / 1.45;
    const controlY = this.y - this.height / 1.65;

    ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = g;
		ctx.lineWidth = getRandomInt(this.width * 1, this.width * 2.75);
    ctx.lineCap = 'round';
		ctx.moveTo(this.x, this.y - this.height);
    ctx.lineTo(this.x, this.y);
		ctx.quadraticCurveTo(
      controlX, controlY,
      this.x + this.width / 1.5, this.y
    );
    ctx.quadraticCurveTo(
      controlX, controlY,
      this.x, this.y - this.height
    );
    ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

	update() {
		this.fade++;
		if (this.fade > this.ttl) {
			this.fade = 0;
			this.x = getRandomInt(0, canvas.width);
			this.width = getRandomInt(minWidth, maxWidth);
		}
	}
}

class init {
  constructor() {
    
    this.animate = this.animate.bind(this);

    this.lines = [];
  	this.lineCount = Math.floor(canvas.width / 3.75);

    this.resize();
    this.animate();
  }

  resize() {
    canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;

  	ctx.drawImage(canvas, 0, 0);

    this.lines = [];

	  for (let i = 0; i < this.lineCount; i++) {
		  this.lines.push(new Line());
	  }
  }

  animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

	  for (let i = 0; i < this.lines.length; i++) {
		  this.lines[i].update();
		  this.lines[i].draw();
	  }

	  ctx.save();
	  ctx.filter = "blur(75px)";
	  ctx.globalCompositeOperation = "lighter";
	  ctx.drawImage(canvas, 0, 0);
	  ctx.restore();

  	requestAnimationFrame(this.animate);
  }
}

const animation = new init();

window.addEventListener('resize',
  function () {
    animation.resize();
  })