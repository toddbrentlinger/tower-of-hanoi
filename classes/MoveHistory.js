"use strict";

import { StackWithLinkedList as Stack } from "./stack.js";

class MoveHistory {
    constructor(containerNode) {
        this.moveHistoryNode = containerNode;
        this.moveHistory = new Stack(); // Stack data structure to hold history of moves
    }

    // Getters 

    get isEmpty() { return this.moveHistory.isEmpty(); }
    get size() { return this.moveHistory.size(); }

    // Methods

    /**
     * 
     * @param {Object} move 
     * @param {Rod} move.from
     * @param {Rod} move.to
     */
    add(move) {
        this.moveHistory.push(move);
        this.print();
    }

    undo() {
        let lastMove = this.moveHistory.pop();
        this.print();
        return lastMove;
    }

    clear() {
        this.moveHistory.clear();
        this.print();
    }

    /**
     * @todo Better solution than removing and drawing every move every time?
     * New move object: move = {from: Rod, to: Rod, element: Element}
     * Add Move - append move.element to container element
     * Undo Move - remove move.element from container element
     * Clear - remove each move.element from container element
     */
    print() {
        // Clear move history container
        while (this.moveHistoryNode.firstChild) {
            this.moveHistoryNode.removeChild(this.moveHistoryNode.firstChild);
        }

        let tempNode = this.moveHistory.head;
        while (tempNode !== null) {
            this.moveHistoryNode.append(MoveHistory.createMoveElement(tempNode.data));
            tempNode = tempNode.next;
        }
    }

    // Static Methods

    static createMoveElement(move) {
        let moveElement = document.createElement('div');
        moveElement.innerHTML = `${move.from.label} -> ${move.to.label}`;
        return moveElement;
    }
}

export default MoveHistory;