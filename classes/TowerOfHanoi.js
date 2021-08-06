"use strict";
import Disk from "./Disk.js";
import Rod from "./Rod.js";
import { StackWithLinkedList } from "./stack.js";

class TowerOfHanoi {
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} nDisks Number of disks
     * @param {Number} nRods Number of rods
     */
    constructor(ctx, nDisks = 4, nRods = 3) {
        this.rods = new Array(nRods); // Initialize rods to empty array
        this.rods[0] = new Rod(nDisks); // Add first rod with all disks
        this.rods.fill(new Rod(), 1); // Add remaining empty rods
        this.moveHistory = new StackWithLinkedList(); // Stack data structure to hold history of moves
    }

    move(fromRod, toRod) {
        // Check if valid move:
        // - No disk may be placed on top of a disk that is smaller than it
    }

    drawRods() {
        const distBetweenRods = ctx.canvas.width / 4;
        for (let i = 0, x = 0; i < this.rods.length; i++, x += distBetweenRods) {
            
        }
    }
}

export default TowerOfHanoi;