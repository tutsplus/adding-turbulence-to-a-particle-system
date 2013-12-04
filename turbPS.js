
(function()
{
  function PlayState()
  {
    var particles=[]
    var vortices=[]

    var useVortices=true
    var showVortices=false

    var numParticles=200
    var numVortices=5

    var particleLifetime=60*2
    var vortexLifetime=60*1.5

    var vortexImage=jaws.assets.get("vortex.png")


    this.setup=function()
    {
      for (var i=0; i<numParticles; ++i)
        particles.push(new Particle(particleLifetime*i/numParticles))

      for (var i=0; i<numVortices; ++i)
        vortices.push(new Vortex(vortexLifetime*i/numVortices))

      jaws.on_keydown("left_mouse_button",
        function()
        {
          if (jaws.mouse_y>=jaws.height-40 && jaws.mouse_y<jaws.height)
          {
            if (jaws.mouse_x<jaws.width/2)
              useVortices=!useVortices
            else
              showVortices=!showVortices
          }
        })
    }

    this.update=function()
    {
      jaws.update(particles, vortices)
    }

    this.draw=function()
    {
      jaws.fill("#def")
      jaws.draw(particles)
      if (useVortices && showVortices) jaws.draw(vortices)

      // draw "buttons"
      if (jaws.mouse_y>=jaws.height-40 && jaws.mouse_y<jaws.height)
      {
        jaws.context.fillStyle="#bcd"
        jaws.context.fillRect(
          (jaws.mouse_x<jaws.width/2 ? 0 : jaws.width/2), jaws.height-40,
          jaws.width/2, 40)
      }

      jaws.context.textAlign="center"
      jaws.context.font="bold 20px sans-serif"
      jaws.context.fillStyle="#00c"

      jaws.context.fillText("Turbulence: "+(useVortices?"ON":"OFF"),
        jaws.width/4, jaws.height-10)

      jaws.context.fillText("Show vortices: "+(showVortices?"ON":"OFF"),
        jaws.width*3/4, jaws.height-10)
    }


    function Vortex(life)
    {
      this.respawn(life)
    }

    Vortex.prototype.respawn=function(life)
    {
      this.x=jaws.width*(Math.random()*0.1+0.1)
      this.y=jaws.height*(0.45+Math.random()*0.1)
      this.vx=Math.random()*2+4
      this.vy=(Math.random()+Math.random()+Math.random()-1.5)*2
      this.life=life
      this.scale=jaws.height*0.002
      this.scale*=this.scale
      this.speed=Math.random()*3+2
      if (Math.random()<0.5) this.speed=-this.speed

      // uncomment to test unmoving vortex
      // this.x=jaws.width/2
      // this.y=jaws.height/2
      // this.vx=0
      // this.vy=0
      // this.speed=-5
    }

    Vortex.prototype.update=function()
    {
      var damping=1-0.005

      this.vx*=damping
      this.vy*=damping
      this.x+=this.vx
      this.y+=this.vy

      this.life-=1
      if (this.life<=0) this.respawn(vortexLifetime)
    }

    Vortex.prototype.draw=function()
    {
      var lifeFactor=this.life/vortexLifetime

      jaws.context.save()
      jaws.context.translate(this.x, this.y)
      jaws.context.rotate(-this.speed*this.life*0.03)
      if (this.speed<0) jaws.context.scale(-1, 1)
      jaws.context.globalAlpha=(1-lifeFactor)*lifeFactor*4
      jaws.context.drawImage(vortexImage,
        -vortexImage.width/2, -vortexImage.height/2)
      jaws.context.restore()
    }


    function Particle(life)
    {
      this.respawn(life)
    }

    Particle.prototype=new jaws.Sprite({ image: "smoke.png", anchor: "center" })

    Particle.prototype.respawn=function(life)
    {
      this.x=jaws.width*(Math.random()*0.1-0.15)
      this.y=jaws.height*(0.45+Math.random()*0.1)
      this.vx=Math.random()*2+4
      this.vy=(Math.random()+Math.random()+Math.random()-1.5)*2
      this.life=life
      this.scaleTo(1)
    }

    Particle.prototype.update=function()
    {
      if (useVortices)
      {
        var self=this
        vortices.forEach(function(vortex)
        {
          var dx=self.x-vortex.x
          var dy=self.y-vortex.y

          var speed=vortex.speed
          var vx=-dy*speed+vortex.vx
          var vy= dx*speed+vortex.vy

          var factor=1/(1+(dx*dx+dy*dy)/vortex.scale)
          var lifeFactor=vortex.life/vortexLifetime
          factor*=(1-lifeFactor)*lifeFactor*4

          self.vx+=(vx-self.vx)*factor
          self.vy+=(vy-self.vy)*factor
        })
      }

      var damping=1-0.005
      this.vx*=damping
      this.vy*=damping

      this.x+=this.vx
      this.y+=this.vy

      this.scaleAll(1.01)

      this.life-=1
      if (this.life<=0) this.respawn(particleLifetime)

      this.alpha=this.life/particleLifetime
    }
  }


  function initGame()
  {
    jaws.assets.add("smoke.png")
    jaws.assets.add("vortex.png")
    jaws.start(PlayState)
    jaws.useSmoothScaling()
  }

  jaws.onload=initGame
})();
