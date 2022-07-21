var angle = 0;

function setup()
{
  canvas = createCanvas(windowWidth, 1700, WEBGL);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  canvas.style('opacity', '0.3');
  frameRate(12);
  background(0);
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
  stroke(255);
  push();
  angle++;
  pop();

  for (var i = 0; i < 177; i++)
  {
    translate(i*13, i*-i)
    stroke(27*i)
    rotate(angle);
    rectMode(CENTER);
    sphere(52);
  }

}
