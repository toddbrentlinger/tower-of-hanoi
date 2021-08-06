"use strict";

//import TowerOfHanoi from "./classes/TowerOfHanoi.js";

const canvasContainerElement = document.getElementById('canvas-container');
const ctx = document.getElementById('canvas-hanoi').getContext('2d');

function handleWindowResize(event) {
    console.log('window resized');
    ctx.canvas.width = canvasContainerElement.offsetWidth;
    ctx.canvas.height = canvasContainerElement.offsetHeight;
}

init();
function init() {
    console.log('init has started');
    // Check canvas context
    if (!ctx) {
        console.error('Canvas NOT supported!');
        return;
    }

    handleWindowResize();
    // Resize event listener for canvas-container to change size of canvas
    canvasContainerElement.addEventListener('resize', handleWindowResize);
    console.log('init has finished');
}