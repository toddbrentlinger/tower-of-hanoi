"use strict";

/**
 * Test if object is empty (supported by older browsers)
 * @param {Object} object
 * @returns {Boolean}
 */
 export function isEmptyObject(object) {
    for (const key in object) {
        if (object.hasOwnProperty(key))
            return false;
    }
    return true;
}

/**
* Create an HTML element with specified tag, class, and inner text.
* @param {String} elementTag
* @param {String} elementClass
* @param {String} elementInnerHTML
* 
* @return {Element}
*/
export function createElement(elementTag, elementClass, elementInnerHTML) {
    // If only first argument is provided, recommend using document.createElement instead
    if (!elementClass && !elementInnerHTML)
        console.log("Use document.createElement() instead");
    let element = document.createElement(elementTag);
    if (elementClass)
        element.setAttribute('class', elementClass);
    if (elementInnerHTML)
        element.innerHTML = elementInnerHTML;
    return element;
}

/**
 * 
 * @param {String} c 
 * @returns {String}
 */
export function nextCharacter(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}