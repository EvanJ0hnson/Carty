/**
 * Get JSON data
 * @param  {String}   url      URL to a file
 * @return {JSON} JSON with booked days
 */
export function getJSON(url, callback) {
  const ajax = new XMLHttpRequest();

  ajax.open('GET', url, true);

  ajax.onreadystatechange = () => {
    if (ajax.readyState === 4) {
      if (ajax.status === 200) {
        return callback(JSON.parse(ajax.responseText));
      }
    }
  };

  ajax.send();
}

/**
 * Get child of a DOM Node
 * @param  {String}  element Element name
 * @return {Element}         DOM element
 */
export function getChild(parent, child) {
  return parent.querySelector(child);
}

/**
 * Get DOM element by selector
 * @param  {String} element Element name
 * @return {Element}         DOM element
 */
export function getElement(selector) {
  return document.querySelector(selector);
}

/**
 * Get Array of DOM elements by selector
 * @param  {String} element Element name
 * @return {Array}         Array of DOM elements
 */
export function getElements(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Remove DOM node
 * @param  {DOM Node} element Dom element
 */
export function remove(element) {
  element.parentNode.removeChild(element);
}

/**
 * Append HTML String to the end of DOM Node
 * @param  {DOM Node} parent     Parent node
 * @param  {String} htmlString String with HTML
 */
export function appendString(parent, htmlString) {
  parent.insertAdjacentHTML('beforeEnd', htmlString);
}

/**
 * Remove class
 * @param  {DOM Node} element   Dom element
 * @param  {String} className Class name
 */
export function removeClass(element, className) {
  element.classList.remove(className);
}

/**
 * Add class
 * @param  {DOM Node} element   Dom element
 * @param  {String} className Class name
 */
export function addClass(element, className) {
  element.classList.add(className);
}

/**
 * Toggle class
 * @param  {DOM Node} element   Dom element
 * @param  {String} className Class name
 */
export function toggleClass(element, className) {
  element.classList.toggle(className);
}
