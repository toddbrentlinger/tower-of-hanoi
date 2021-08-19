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

    add(move) {
        this.moveHistory.push(move);
    }

    undo() {
        return this.moveHistory.pop();
    }

    clear() {
        this.moveHistory.clear();
    }

    print() {
        let tempNode = this.moveHistory;
        while (tempNode !== null) {
            this.moveHistoryNode.append(createMoveElement(tempNode.data));
            tempNode = tempNode.next;
        }
    }

    // Static Methods

    static createMoveElement(move) {
        let moveElement = document.createElement('div');
        moveElement.innerHTML = `${''} -> ${''}`;
    }
}