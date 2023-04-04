var angle = 0;

function setup()
{
  canvas = createCanvas(windowWidth, 1700, WEBGL);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  canvas.style('opacity', '0.3');
  frameRate(12);

  noCursor();
  angleMode(DEGREES);
}

function draw()
{
  push();
  rotate(angle);
  rectMode(CENTER);
  sphere(52);
  noFill();
  stroke(0);
  push();
  angle++;
  pop();

  for (var i = 0; i < 24; i++)
  {
    translate(i*13, i*-i)
    stroke(i,i*27,i+12)
    rotate(angle);
    rectMode(CENTER);
    sphere(52+random(25,i));
    for (var j = 0; j < 14; j++){
      sphere(i+random(25,j));
      stroke(0,j,i*52)
    }
  }

}
