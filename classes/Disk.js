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
        this.color = getRandomColor();
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
}

export default Disk;