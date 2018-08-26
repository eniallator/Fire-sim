let pixels = []
let newPixels = []
const fireSourceLevel = 5
const cooling = 0.05

const width = 960
const height = 540

const canvas = document.getElementById('main')
const ctx = canvas.getContext('2d')

canvas.width = width
canvas.height = height

let imgData = ctx.createImageData(width, height)

for (let y = 0; y < height; y++) {
    newPixels.push([])
    pixels.push([])
    for (let x = 0; x < width; x++) newPixels[y][x] = pixels[y][x] = y > fireSourceLevel ? 0 : 1
}

function applySpread(x, y) {
    const spreadMatrix = [[0.8, 0.7, 0.8], [0.9, 1.0, 0.9], [0.95, 0.99, 0.95]]
    let outPix = 0

    if (y <= fireSourceLevel) return 1

    for (let xOff = 0; xOff < 3; xOff++) {
        const currX = x + xOff - 1
        if (currX >= 0 && currX < width) {
            for (let yOff = 0; yOff < 3; yOff++) {
                const currY = y + yOff - 1
                if (currY < height) {
                    outPix += (pixels[currY][currX] * spreadMatrix[yOff][xOff]) / 9
                }
            }
        }
    }

    return outPix
}

// applySpread = (x, y, pixels) =>
//     ((pixels[y - 1] ? pixels[y - 1][x] : 0) +
//         (pixels[y + 1] ? pixels[y + 1][x] : 0) +
//         (pixels[y][x - 1] ? pixels[y][x - 1] : 0) +
//         (pixels[y][x + 1] ? pixels[y][x + 1] : 0)) /
//     4

function update() {
    for (let y = fireSourceLevel; y < height - 1; y++)
        for (let x = 0; x < width; x++) {
            const newVal = applySpread(x, y, pixels) - cooling
            newPixels[y + 1][x] = newVal >= 0 ? newVal : 0
        }
    const temp = pixels
    pixels = newPixels
    newPixels = temp
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
            const pix = (y * width + x) * 4
            const val = Math.floor(pixels[y][x] * 256)
            imgData.data[pix] = val
            imgData.data[pix + 1] = val
            imgData.data[pix + 2] = val
            imgData.data[pix + 3] = 255
        }
}

function draw() {
    ctx.putImageData(imgData, 0, 0)
}

function run() {
    update()
    draw()
    // setTimeout(run, 1000)
    requestAnimationFrame(run)
}

run()
