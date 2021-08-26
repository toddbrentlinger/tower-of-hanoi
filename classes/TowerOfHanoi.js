"use strict";

import Rod from "./Rod.js";
import MoveHistory from "./MoveHistory.js";
import { StackWithLinkedList as Stack } from "./stack.js";
import { createElement, nextCharacter } from "./utilities.js";

/** TODO:
 * - Use LinkedList instead of dynamic arrays with changing or unknown size  
 */

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
        this.rods = TowerOfHanoi.createRodsArray(nDisks, nRods);
        
        this.fromRodInput = 0;
        this.toRodInput = 0;

        this.solutionInterval = null;

        this.moveHistory = new MoveHistory(document.getElementById('move-history'));

        this.messageFieldNode = document.getElementById('message-field');

        // Add event listeners to inputs in input container
        document.getElementById('nDisks').addEventListener('change', function(event) {
            console.log('input has changed');
            let value = event.target.value;
            // On browsers that don't support inputs of type number, a number input falls back to type text.
            // If value type if string, convert to number
            if (typeof value == 'string') {
                value = Number.parseInt(value, 10);
                // Return if converted value is not a number
                if (isNaN(value)) return;
            }

            // Assign new nDisks
            this.nDisks = value;

            // Assign new rods
            this.rods = TowerOfHanoi.createRodsArray(this.nDisks, this.nRods);

            // Reset puzzle
            this.reset();
        }.bind(this));

        // Add buttons
        const buttonContainer = document.getElementById('buttons-container');
        let temp = new Array(this.rods.length);
        for (let i = 0, c = 'A'; i < temp.length; i++, c = nextCharacter(c)) temp[i] = {value: i, text: c};
        
        // Move - From
        function handleFromInputChange(event) {
            if (this.fromRodInput !== event.target.value)
                this.fromRodInput = Number.parseInt(event.target.value, 10);
        }
        buttonContainer.append(TowerOfHanoi.createInputField('From Rod: ', 'moveFrom', temp, handleFromInputChange.bind(this), 'rod-move-select'));
        
        // Move - To
        function handleToInputChange(event) {
            if (this.toRodInput !== event.target.value)
                this.toRodInput = Number.parseInt(event.target.value, 10);
        }
        buttonContainer.append(TowerOfHanoi.createInputField('To Rod: ', 'moveTo', temp, handleToInputChange.bind(this), 'rod-move-select'));

        // Button Container
        temp = buttonContainer.appendChild(createElement('div', 'btn-container'));

        // Move Button
        temp = temp.appendChild(createElement('button', undefined, 'Move'));
        temp.addEventListener('click', function() {
            this.move(this.rods[this.fromRodInput], this.rods[this.toRodInput]);
        }.bind(this));

        // Undo Button
        temp = temp.parentElement.appendChild(createElement('button', undefined, 'Undo'));
        temp.addEventListener('click', function() {
            this.undoMove();
        }.bind(this));

        // Solve Button
        temp = temp.parentElement.appendChild(createElement('button', undefined, 'Solve'));
        temp.addEventListener('click', function() {
            this.solve();
        }.bind(this));

        // Reset Button
        temp = temp.parentElement.appendChild(createElement('button', undefined, 'Reset'));
        temp.addEventListener('click', function() {
            this.reset();
        }.bind(this));

        // Solve Container
        document.getElementById('solve-header').addEventListener('click', function() {
            this.style.maxHeight = this.style.maxHeight ? null : undefined;
        });

        // Solve Container - Play

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
        //if (!fromRod.topDisk || (toRod.topDisk && fromRod.topDisk.size > toRod.topDisk.size)) {
        if (!TowerOfHanoi.isMoveValid(fromRod, toRod)) {
            //console.error('Move NOT valid');
            this.printMessage('Move NOT valid');
            return;
        }
        // Move disk from fromRod to toRod
        toRod.addDisk(fromRod.removeDisk());

        // Add move to moveHistory
        this.moveHistory.add({
            from: fromRod,
            to: toRod
        });

        // Print message
        this.printMessage(`Disk Moved From Rod ${String.fromCharCode('A'.charCodeAt(0) + this.rods.indexOf(fromRod))} to Rod ${String.fromCharCode('A'.charCodeAt(0) + this.rods.indexOf(toRod))}`);

        // Check if puzzle complete
        this.isPuzzleComplete();

        // Update canvas
        this.draw();
    }

    undoMove() {
        // Check if moveHistory is empty
        if (this.moveHistory.isEmpty) {
            return;
        }
        const prevMove = this.moveHistory.undo();
        prevMove.from.addDisk(prevMove.to.removeDisk());
        this.printMessage('Undo previous move');
        this.draw();
    }

    draw() {
        // Clears canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        const distBetweenRodCenters = this.ctx.canvas.width / this.nRods;

        for (let i = 0, x = distBetweenRodCenters / 2; i < this.rods.length; i++, x += distBetweenRodCenters) {
            this.rods[i].draw(this.ctx, x, this.rodWidth, this.rodHeight, this.diskUnitWidth, this.diskHeight)
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

    /** Returns true if Tower of Hanoi has been solved, else returns false. */
    isPuzzleComplete() {
        const isPuzzleComplete =  this.rods[0].isEmpty() && this.rods[1].isEmpty();
        if (isPuzzleComplete) {
            this.printMessage(`Puzzle Completed in ${this.moveHistory.size} Moves!`);
        }
        return isPuzzleComplete;
    }

    /** Resets Tower of Hanoi to initial state where all disks are on left rod. */
    reset() {
        // Clear intervals
        clearInterval(this.solutionInterval);

        // Combine and sort each Stack intance of Disks inside each Rod
        const firstRod = this.rods[0];
        let tempNode;
        for (let i = 1; i < this.rods.length; i++) {
            tempNode = this.rods[i].disks.head;
            while (tempNode !== null) {
                TowerOfHanoi.sortedInsert(firstRod.disks, tempNode.data);
                tempNode = tempNode.next;
            }
            this.rods[i].disks.head = null;
        }
        // Clear move history
        this.moveHistory.clear();

        // Print message
        this.printMessage('Puzzle Reset');

        // Draw updated canvas
        this.draw();
    }

    /** Solves Tower of Hanoi and makes each move. */
    solve() {
        // Reset so all disks are on left rod
        this.reset();
        // Make each move at time interval
        this.getSolutionSimple();
    }

    getSolutionSimple() {
        /*
        For an even number of disks:

        make the legal move between pegs A and B (in either direction),
        make the legal move between pegs A and C (in either direction),
        make the legal move between pegs B and C (in either direction),
        repeat until complete.

        For an odd number of disks:

        make the legal move between pegs A and C (in either direction),
        make the legal move between pegs A and B (in either direction),
        make the legal move between pegs B and C (in either direction),
        repeat until complete.

        In each case, a total of 2n − 1 moves are made.
         */
        const getValidMove = function(rodA, rodB) {
            return TowerOfHanoi.isMoveValid(rodA, rodB) ? {from: rodA, to: rodB} : {from: rodB, to: rodA};
        }.bind(this);
        let nextMove;
        this.solutionInterval = setInterval(() => {
            // Check win condition
            if (this.isPuzzleComplete()) {
                console.log(`Puzzle complete in ${this.moveHistory.size} moves`);
                clearInterval(this.solutionInterval);
                return;
            }

            switch(this.moveHistory.size % 3) {
                case 0:
                    // Odd N Disks: make the legal move between pegs A and C (in either direction)
                    // Even N Disks: make the legal move between pegs A and B (in either direction)
                    nextMove = (this.nDisks % 2) ? getValidMove(this.rods[0], this.rods[2]) : getValidMove(this.rods[0], this.rods[1]);
                    break;
                case 1:
                    // Odd N Disks: make the legal move between pegs A and B (in either direction)
                    // Even N Disks: make the legal move between pegs A and C (in either direction)
                    nextMove = (this.nDisks % 2) ? getValidMove(this.rods[0], this.rods[1]) : getValidMove(this.rods[0], this.rods[2]);
                    break;
                case 2:
                    // Any N Disks: make the legal move between pegs B and C (in either direction)
                    nextMove = getValidMove(this.rods[1], this.rods[2]);
                    break;
                default:
                    nextMove = null;
            }
            if (nextMove)
                this.move(nextMove.from, nextMove.to);

            console.log(`Move ${this.moveHistory.size} complete!`);
        }, 1000);
    }

    getSolutionIterative() {

    }

    getSolutionRecursive() {

    }

    /** Prints message to element with id="message-field" */
    printMessage(message) {
        // Check type
        if (typeof message !== 'string') return;

        //this.messageFieldNode.classList.remove('fade-out');
        this.messageFieldNode.innerHTML = message;
        //this.messageFieldNode.classList.add('fade-out');
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

    static isMoveValid(fromRod, toRod) {
        // NOT Valid If:
        // - NO disk on fromRod
        if (!fromRod.topDisk) return false;
        // - No disk may be placed on top of a disk that is smaller than it
        if (toRod.topDisk && fromRod.topDisk.size > toRod.topDisk.size) return false;
        // Move is valid if reach here
        return true;
    }

    static createRodsArray(nDisks, nRods) {
        const rodsArr = new Array(nRods); // Initialize rods to empty array
        rodsArr[0] = new Rod('A', nDisks); // Add first rod with all disks
        // Add remaining empty rods
        for (let i = 1, c = 'B'; i < rodsArr.length; i++, c = nextCharacter(c)) {
            rodsArr[i] = new Rod(c);
        }
        return rodsArr;
    }

    static createInputField(title, name, optionsArr, handleChange, containerClass = null) {
        /*
        <div>
            <p>From Rod:</p>
            <div>
                <input type="radio" id="moveFrom-0" name="moveFrom" value="0" checked>
                <label for="moveFrom-0">A</label>
            </div>
            <div>
                <input type="radio" id="moveFrom-1" name="moveFrom" value="1">
                <label for="moveFrom-1">B</label>
            </div>
            <div>
                <input type="radio" id="moveFrom-2" name="moveFrom" value="2">
                <label for="moveFrom-2">C</label>
            </div>
        </div>
         */

        // Check if optionsArr is empty
        if (!optionsArr.length) return;

        const containerElement = document.createElement('div');
        if (containerClass)
            containerElement.classList.add(containerClass);

        containerElement.append(createElement('p', null, title));

        let tempParent;
        let tempChild;
        optionsArr.forEach((option, index) => {
            tempParent = containerElement.appendChild(document.createElement('div'));

            tempChild = tempParent.appendChild(document.createElement('input'));
            tempChild.type = 'radio';
            tempChild.id = `${name}-${option.value}`;
            tempChild.name = name;
            tempChild.value = option.value;
            tempChild.addEventListener('change', handleChange);
            if (index == 0) tempChild.checked = true;

            tempChild = tempParent.appendChild(document.createElement('label'));
            tempChild.htmlFor = `${name}-${option.value}`;
            tempChild.innerHTML = option.text;
        });

        return containerElement;
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

    /**
     * Inserts disk in rod in sorted order
     * @param {Stack} diskStack 
     * @param {Disk} disk 
     */
    static sortedInsert(diskStack, disk) {
        if (diskStack.isEmpty() || disk.size <= diskStack.peek().size) {
            diskStack.push(disk);
        }
        /* Else disk at top of stack is less than disk to insert, pop the top item
         * and recursively call sortedInsert. */
        else {
            const temp = diskStack.pop();
            TowerOfHanoi.sortedInsert(diskStack, disk);

            // Push back the top item removed earlier
            diskStack.push(temp);
        }
    }
}

export default TowerOfHanoi;