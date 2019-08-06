
var particles = [];
let reductionFactor = 77;
var particleCanvas, particleCtx;
function createParticleCanvas() {
  // Create our canvas
  particleCanvas = document.createElement("canvas");
  particleCtx = particleCanvas.getContext("2d");
  
  // Size our canvas
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  
  // Position out canvas
  particleCanvas.style.position = "absolute";
  particleCanvas.style.top = "0";
  particleCanvas.style.left = "0";
  
  // Make sure it's on top of other elements
  particleCanvas.style.zIndex = "1001";
  
  // Make sure other elements under it are clickable
  particleCanvas.style.pointerEvents = "none";
  
  // Add our canvas to the page
  document.body.appendChild(particleCanvas);
}
createParticleCanvas()

function colorArray(array){

  let shades = []

  function makeShade(R,G,B,percent){
    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    return [R,B,B]
  }

  for(let i= ((255 - array[0])/255) * 100; i < 100 ; i++ ){
    shades.push( makeShade(array[0],array[1],array[2],i))
  }
  return shades
}


class ExplodingParticle {
  
  constructor(...prop){

   
    this.rgbArray = prop[0];
    this.startX = prop[1];
    this.startY = prop[2];
    this.startTime = Date.now() ;
    // Set how long we want our particle to animate for
    this.animationDuration = 1000; // in ms

    // Set the speed for our particle
    this.speed = {
      x: -5 + Math.random() * 10,
      y: -5 + Math.random() * 10
    };
    
    // Size our particle
    this.radius = 5 + Math.random() * 5;
    
    // Set a max time to live for our particle
    this.life = 30 + Math.random() * 10;
    this.remainingLife = this.life;
    
    particles.push(this)
    // This function will be called by our animation logic later on
    this.draw = ctx => {
      let p = this;

      if(this.remainingLife > 0
      && this.radius > 0) {
        // Draw a circle at the current location
        ctx.beginPath();
        ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + this.rgbArray[0] + ',' + this.rgbArray[1] + ',' + this.rgbArray[2] + ", 1)";
        ctx.fill();
        
        // Update the particle's location and life
        p.remainingLife--;
        p.radius -= 0.25;
        p.startX += p.speed.x;
        p.startY += p.speed.y;
      }
    }
  }
}

function update() {
  // Clear out the old particles
  if(typeof particleCtx !== "undefined") {
    particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  // Draw all of our particles in their new location
  for(let i = 0; i < particles.length; i++) {
    particles[i].draw(particleCtx);
    
    // Simple way to clean up if the last particle is done animating
    if(i === particles.length - 1) {
      let percent = (Date.now() - particles[i].startTime) / particles[i].animationDuration[i];
      
      if(percent > 1) {
        particles = [];
      }
    }
  }
  
  // Animate performantly
  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

function makeParticles(e) {
  // Get the color data for our button
  let width = e.target.offsetWidth;
  let height = e.target.offsetHeight
  var str = getComputedStyle(e.target).getPropertyValue("background");
/* Goal: rgb(14,48,71) */

// var str = "linear-gradient(to right, #ee0979, rgb(100,58,183) 
var res = str.match( /(?:rgba|rgb)\((.*?)\)/g );
if(res) res = colorArray(res[res.length -1].match( /(?:rgba|rgb)\((.*?)\)/ )[1].split(','))
  // console.log(res,str)
  
  let colorData = res || colorArray([238, 9, 121]);
  
  // Keep track of how many times we've iterated (in order to reduce
  // the total number of particles create)
  let count = 0;
  
  // Go through every location of our button and create a particle
  for(let localX = 0; localX < width; localX++) {
    for(let localY = 0; localY < height; localY++) {
      if(count % reductionFactor === 0) {
        let rgbaColorArr = colorData[Math.floor(Math.random()*colorData.length)]; 

 
        let bcr = e.target.getBoundingClientRect();
        let globalX = bcr.left + localX;
        let globalY = bcr.top + localY;

        new ExplodingParticle(rgbaColorArr,globalX,globalY)
      }
      count++;
    }
  }
}

let buttons = document.querySelectorAll('button')
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", makeParticles);
}

// document.querySelector('button')
