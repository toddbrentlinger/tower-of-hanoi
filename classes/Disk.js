"use strict";

function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

class Disk {
    constructor(size) {
        this.rod = null; // Current rod disk is on
        this.rodPosition = null; // Position on rod
        this.size = size;
        // Apply random color
        this.color = this.getColor();
    }

    draw(ctx, bottomCenterX, bottomCenterY, unitWidth, height) {
        const width = this.size * unitWidth;
        ctx.fillStyle = this.color;
        ctx.fillRect(bottomCenterX - width / 2, bottomCenterY - height, width, height);
    }

    drawOld(ctx, centerX, centerY, width, height) {
        ctx.fillStyle = this.color;
        ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
    }

    getColor() {
        switch(this.size % 5) {
            case 0: // Red
                return 'rgb(255,0,0)';
            case 1:
                return 'rgb(255,255,0)';
            case 2: // Green
                return 'rgb(0,255,0)';
            case 3:
                return 'rgb(0,255,255)';
            case 4: // Blue
                return 'rgb(0,0,255)';
            default:
                return getRandomColor();
        }
    }
}

export default Disk;