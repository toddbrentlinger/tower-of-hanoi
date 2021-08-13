"use strict";
import { StackWithLinkedList as Stack } from "./stack.js"
import Disk from "./Disk.js";

class Rod {
    constructor(nDisks = 0) {
        this.disks = new Stack();
        for (let i = nDisks; i > 0; i--) {
            this.disks.push(new Disk(i));
        }
    }

    get topDisk() { return this.disks.peek(); }

    addDisk(disk) {
        this.disks.push(disk);
    }

    removeDisk() {
        return this.disks.pop();
    }

    draw(ctx, originX, rodWidth, rodHeight, diskUnitWidth, diskHeight) {
        // Draw rod
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(
            originX - rodWidth / 2, ctx.canvas.height - rodHeight,
            rodWidth, rodHeight
        );
        
        // Draw any disks on rod
        let currDiskNode = this.disks.head;
        let bottomCenterY = ctx.canvas.height - (this.disks.size() - 1) * diskHeight;
        while(currDiskNode !== null) {
            currDiskNode.data.draw(ctx, originX, bottomCenterY, diskUnitWidth, diskHeight)
            currDiskNode = currDiskNode.next;
            bottomCenterY += diskHeight;
        }
    }

    isEmpty() {
        return !this.disks.head;
    }
}

export default Rod;