"use strict";

// ---------- Stack ----------

// ---------- Stack With Linked List ----------

export class StackNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

export class StackWithLinkedList {
    /**
     * @constructor
     * @param {StackNode} firstNode
     */
    constructor(firstNode = null) {
        this.head = firstNode;
    }

    /** Returns true if stack is empty, else false. */
    isEmpty() {
        return (this.head === null);
    }

    /**
     * Adds an item in the stack. If the stack is full, then it is said to be an Overflow condition.
     * @param {any} item
     */
    push(item) {
        const newNode = new StackNode(item);

        if (this.isEmpty()) {
            this.head = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        //console.log(`${data} pushed to stack`);
    }

    /** Removes an item from the stack. The items are popped in the reversed order in which they are pushed. If the stack is empty, then it is said to be an Underflow condition. */
    pop() {
        if (this.isEmpty()) {
            //console.log("Stack is Empty");
        } else {
            const poppedData = this.head.data;
            this.head = this.head.next;
            //console.log(`${poppedData} popped from stack`);
            return poppedData;
        }
    }

    /** Returns top element of stack. */
    peek() {
        if (this.isEmpty()) {
            //console.log("Stack is Empty");
        } else {
            //console.log(`${this.head.data} on top of stack`);
            return this.head.data;
        }
    }

    /** Print each element of stack (top-to-bottom) to console. */
    print() {
        if (this.isEmpty()) {
            //console.log("Stack is Empty");
        } else {
            let currNode = this.head;
            while (currNode !== null) {
                console.log(currNode.data);
                currNode = currNode.next;
            }
        }
    }

    /**
     * Recursive function that inserts an element at bottom of the stack.
     * @param {any} item
     */
    insertAtBottom(item) {
        if (this.isEmpty()) {
            this.push(item);
        } else {
            /* All items are held in Function Call Stack until we reach end
             * of the stack. When the stack becomes empty, the above if part is
             * executed and the item is inserted at the bottom. */
            const topItem = this.pop();
            this.insertAtBottom(item);

            /* Push all the items held in Function Call Stack once the item
             * is inserted at the bottom. */
            this.push(topItem);
        }
    }

    /** Reverse the linked list instance using recursive insertAtBottom() */
    reverse() {
        if (!this.isEmpty()) {
            /* Hold all items in Function Call Stack until we reach end of
             * the stack. */
            const topItem = this.pop();
            this.reverse();

            /* Insert all the items held in Function Call Stack one by one
             * from the bottom to top. Every item is inserted at the bottom. */
            this.insertAtBottom(topItem);
        }
    }

    /**
     * Sorts stack with values in ascending/descending order.
     * @param {Boolean} toAscending
     */
    sort(toAscending = true) {
        if (!this.isEmpty()) {
            const temp = this.pop(); // Pop top item
            this.sort(toAscending); // Sort remaining stack

            // Push the top item back to sorted stack
            if (toAscending)
                StackWithLinkedList.sortedInsert(this, temp);
            else
                StackWithLinkedList.sortedInsertDescending(this, temp);
        }
    }

    size() {
        let counter = 0;
        let currNode = this.head;
        while (currNode !== null) {
            ++counter;
            currNode = currNode.next;
        }
        return counter;
    }

    /**
     * Insert element into stack in ascending sorted way.
     * @param {StackWithLinkedList} stack
     * @param {any} element
     */
    static sortedInsert(stack, element) {
        if (stack.isEmpty() || element > stack.peek()) {
            stack.push(element);
        }
        /* Else top of stack is greater than element, pop the top item
         * and recursively call sortedInsert. */
        else {
            const temp = stack.pop();
            StackWithLinkedList.sortedInsert(stack, element);

            // Push back the top item removed earlier
            stack.push(temp);
        }
    }

    /**
     * Insert element into stack in descending sorted way.
     * @param {StackWithLinkedList} stack
     * @param {any} element
     */
    static sortedInsertDescending(stack, element) {
        if (stack.isEmpty() || element < stack.peek()) {
            stack.push(element);
        }
        /* Else top of stack is lesser than element, pop the top item
         * and recursively call sortedInsertDescending. */
        else {
            const temp = stack.pop();
            StackWithLinkedList.sortedInsertDescending(stack, element);

            // Push back the top item removed earlier
            stack.push(temp);
        }
    }
}