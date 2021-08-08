"use strict";
import Disk from "./Disk.js";
import Rod from "./Rod.js";
import { StackWithLinkedList as Stack } from "./stack.js";

export class TowerOfHanoi {
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} nDisks Number of disks
     * @param {Number} nRods Number of rods
     */
    constructor(ctx, nDisks = 4, nRods = 3) {
        this.ctx = ctx; // CanvasRenderingContext2D
        this.nDisks = nDisks;
        this.moveHistory = new Stack(); // Stack data structure to hold history of moves
        this.rods = new Array(nRods); // Initialize rods to empty array
        this.rods[0] = new Rod(nDisks); // Add first rod with all disks
        // Add remaining empty rods
        for (let i = 1; i < this.rods.length; i++) {
            this.rods[i] = new Rod();
        }
    }

    get nRods() { return this.rods.length; }
    get rodWidth() { return this.ctx.canvas.width * 0.03; }
    get rodHeight() { return this.ctx.canvas.height * 0.75; }
    get diskUnitWidth() { return this.ctx.canvas.width * 0.3 / this.nDisks; }
    get diskHeight() { return this.rodHeight / this.nDisks; }

    // Public Methods 

    move(fromRod, toRod) {
        // Check if valid move:
        // - No disk may be placed on top of a disk that is smaller than it
        if (!fromRod.topDisk || (toRod.topDisk && fromRod.topDisk.size > toRod.topDisk.size)) {
            console.error('Move NOT valid');
            return;
        }
        toRod.addDisk(fromRod.removeDisk());
        this.draw();
    }

    draw() {
        // Clears canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        const distBetweenRodCenters = this.ctx.canvas.width / this.nRods;

        for (let i = 0, x = distBetweenRodCenters / 2; i < this.rods.length; i++, x += distBetweenRodCenters) {
            this.rods[i].draw(this.ctx, x, this.rodWidth, this.rodHeight, this.diskUnitWidth, this.diskHeight)
            //this.rods.forEach(rod => rod.draw(this.ctx, x, this.rodWidth, this.rodHeight, this.diskUnitWidth, this.diskHeight));
        }
    }

    // Static Methods

    static init(ctx, nDisks = 4, nRods = 3) {
        console.log('init has started');
        // Check canvas context
        if (!ctx) {
            console.error('Canvas NOT supported!');
            return;
        }

        // Create instance of TowerOfHanoi
        const towerOfHanoi = new TowerOfHanoi(ctx, nDisks, nRods);

        // Parent element used to dynamically resize canvas if window resizes
        const canvasContainerElement = ctx.canvas.parentElement;

        // Handle window resize event
        function handleWindowResize(event) {
            console.log('window resized');
            ctx.canvas.width = canvasContainerElement.offsetWidth;
            ctx.canvas.height = canvasContainerElement.offsetHeight;
            towerOfHanoi.draw();
        }
        // Resize event listener for canvas-container to change size of canvas
        window.addEventListener('resize', handleWindowResize);
        handleWindowResize();

        towerOfHanoi.draw();

        // TEMP START
        window.towerOfHanoi = towerOfHanoi;
        // TEMP END

        console.log('init has finished');
    }
}

export default TowerOfHanoi;