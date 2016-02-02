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
        return callback(ajax.responseText);
      }
    }
  };

  ajax.send();
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
