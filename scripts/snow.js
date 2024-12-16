const body = document.body
const canvas = document.getElementById("SnowCanvas")
const c = canvas.getContext("2d")

canvas.resize = () => {
    canvas.width = body.clientWidth - 1
    canvas.height = body.clientHeight - 1
}
canvas.resize()

addEventListener("resize", () => canvas.resize())

let Vector2 = (x, y) => { return { x, y } }
let Random = (min = 0, max = 1) => { return Math.random() * (max - min) + min }
let AddFlakes = (count, delay, array) => {
    for (i = 0; i < count; i++) {
        const snow = new SnowFlake(canvas)
        snow.Image.src = "./sources/snowflake-solid.svg"
        
        setTimeout(() => array.push(snow), i * delay)
    }
}

// settings-------------------------------------------
let RandPos = () => Vector2( Random(0, canvas.width), 0 ) // position
let RandVel = () => Vector2( 0, Random(1, 1.5) )          // velocity
let RandRadius = () => Random(1, 3)                       // flake radius
let Motion = (delta, scale = 1) => scale * Math.cos(delta)// motion
// settings-------------------------------------------

class SnowFlake{
    static counter = 0
    
    constructor(canvas) {
        this.pos = RandPos()
        this.radius = RandRadius()
        this.vel = RandVel()
        this.Image = new Image()
        this.canvas = canvas
        this.c = this.canvas.getContext("2d")
        this.id = SnowFlake.counter++
    }

    draw() {
        if (this.Image.src == "") { // if no image
            this.c.beginPath()
            this.c.fillStyle = "white"
            this.c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
            this.c.fill()
        } else {
            try {
                c.drawImage(this.Image, this.pos.x, this.pos.y)
            } catch { console.log(`Can't draw ${this.Image}`) }
        }
    }

    update(delta) {
        this.draw()

        // move
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y

        // swing
        this.vel.x = Motion(this.id + delta / 1000)
        
        // reset
        if (this.pos.y > canvas.height + this.radius) {
            this.pos = RandPos()
            this.vel = RandVel()
            this.radius = RandRadius()
        }
    }
}

const Flakes = []
AddFlakes(50, 500, Flakes)

function main(delta) {
    c.reset()

    Flakes.forEach(flake => flake.update(delta))

    requestAnimationFrame(main)
}

main()