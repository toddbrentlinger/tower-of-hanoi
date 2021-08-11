"use strict";
import Disk from "./Disk.js";
import Rod from "./Rod.js";
import { StackWithLinkedList as Stack } from "./stack.js";
import { createElement, isEmptyObject } from "./utilities.js";

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
        this.rods = TowerOfHanoi.createRodsArray(nDisks, nRods);
        
        this.fromRod = 0;
        this.toRod = 0;
        this.isDiskMoving = false;

        // Add buttons
        const buttonContainer = document.getElementById('buttons-container');
        let temp;
        // Move - From
        temp = new Array(this.rods.length);
        for (let i = 0; i < temp.length; i++) temp[i] = {value: i, text: i};
        function handleSelectChange(event) {
            switch(event.target.name) {
                case 'moveFrom':
                    this.fromRod = parseInt(event.target.value, 10);
                    break;
                case 'moveTo':
                    this.toRod = parseInt(event.target.value, 10);
                    break;
                default:
            }
        }
        TowerOfHanoi.createSelectElement('From Rod: ', 'move-from-select', 'moveFrom', temp, handleSelectChange.bind(this))
            .forEach(element => buttonContainer.append(element));
        // Move - To
        TowerOfHanoi.createSelectElement('To Rod: ', 'move-to-select', 'moveTo', temp, handleSelectChange.bind(this))
            .forEach(element => buttonContainer.append(element));

        // Move Button
        temp = createElement('button', undefined, 'MOVE');
        temp.addEventListener('click', function() {
            // Move based on selected inputs
            this.move(this.rods[this.fromRod], this.rods[this.toRod]);
        }.bind(this));
        buttonContainer.append(temp);

        // Undo Button
        temp = createElement('button', undefined, 'UNDO');
        temp.addEventListener('click', function() {
            this.undoMove();
        }.bind(this));
        buttonContainer.append(temp);

        // Handle canvas click event
        function handleCanvasClick(event) {
            console.log('canvas clicked!');
        }
        this.ctx.canvas.addEventListener('click', handleCanvasClick);
        
        // Resize event listener for canvas-container to change size of canvas
        window.addEventListener('resize', function() { 
            this.handleWindowResize(); 
        }.bind(this));
        this.handleWindowResize();
    }

    get nRods() { return this.rods.length; }
    get rodWidth() { return this.ctx.canvas.width * 0.03; }
    get rodHeight() { return this.ctx.canvas.height * 0.75; }
    get diskUnitWidth() { return this.ctx.canvas.width * 0.3 / this.nDisks; }
    get diskHeight() { return Math.ceil(this.rodHeight / this.nDisks); }

    // Public Methods 

    move(fromRod, toRod) {
        // Check if valid move:
        // - No disk may be placed on top of a disk that is smaller than it
        if (!fromRod.topDisk || (toRod.topDisk && fromRod.topDisk.size > toRod.topDisk.size)) {
            console.error('Move NOT valid');
            return;
        }
        // Move disk from fromRod to toRod
        toRod.addDisk(fromRod.removeDisk());

        // Add move to moveHistory
        this.moveHistory.push({
            from: fromRod,
            to: toRod
        });

        // Update canvas
        this.draw();
    }

    undoMove() {
        // Check if moveHistory is empty
        if (this.moveHistory.isEmpty()) {
            return;
        }
        const prevMove = this.moveHistory.pop();
        prevMove.from.addDisk(prevMove.to.removeDisk());
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

    // Handle window resize event
    // Parent element used to dynamically resize canvas if window resizes
    handleWindowResize() {
        console.log('window resized');
        this.ctx.canvas.width = this.ctx.canvas.parentElement.offsetWidth;
        this.ctx.canvas.height = this.ctx.canvas.parentElement.offsetHeight;
        this.draw();
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

        // TEMP START
        window.towerOfHanoi = towerOfHanoi;
        // TEMP END

        console.log('init has finished');
    }

    static createRodsArray(nDisks, nRods) {
        const rodsArr = new Array(nRods); // Initialize rods to empty array
        rodsArr[0] = new Rod(nDisks); // Add first rod with all disks
        // Add remaining empty rods
        for (let i = 1; i < rodsArr.length; i++) {
            rodsArr[i] = new Rod();
        }
        return rodsArr;
    }

    static createSelectElement(labelText, id, name, optionsArr, handleChange, bReturnInContainer = false, containerClass = null) {
        // Check if optionsArr is empty
        if (!optionsArr.length) return;

        // Label
        const labelElement = document.createElement('label');
        labelElement.htmlFor = id;
        labelElement.innerHTML = labelText;
        
        // Select
        const selectElement = document.createElement('select');
        selectElement.id = id;
        selectElement.name = name || id;
        selectElement.addEventListener('change', function(event) {
            handleChange(event);
        });
        // Add option elements to select element
        let temp;
        optionsArr.forEach(option => {
            temp = document.createElement('option');
            temp.value = option.value;
            temp.innerHTML = option.text;
            selectElement.append(temp);
        });

        if (bReturnInContainer) {
            temp = createElement('div', containerClass);
            temp.append(labelElement);
            temp.append(selectElement);
            return temp;
        }

        return [labelElement, selectElement];
    }
}

export default TowerOfHanoi;