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
    if (typeof elementClass === 'undefined' && typeof elementInnerHTML === 'undefined')
        console.log("Use document.createElement() instead");
    let element = document.createElement(elementTag);
    if (typeof elementClass !== 'undefined')
        element.setAttribute('class', elementClass);
    if (typeof elementInnerHTML !== 'undefined')
        element.innerHTML = elementInnerHTML;
    return element;
}