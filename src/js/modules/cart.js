/**
 * @module modules/cart
 */
import * as modalWindow from './modal';
import * as $u from './utilites';

import hbsCart from '../../templates/cart.hbs';

/**
 * Cart constructor
 * @param  {String} id Object Id
 * @constructor
 * @public
 */
function Cart(id) {
  /**
   * Cart items
   * @type {Array}
   * @private
   */
  this._data = null;

  /**
   * Object that contains Cart widjet
   * @type {DOM Node}
   * @private
   */
  this._widjetObj = null;

  /**
   * Object that contains Cart widjet data
   * @type {DOM Node}
   * @private
   */
  this._widjetData = null;

  /**
   * ID of the widjet object
   * @type {String}
   * @private
   */
  this._widjetID = id;

  /**
   * Cart events
   * @type {Object}
   * @private
   */
  this._events = null;
}

/**
 * Render Handlebars template
 * @return {String} String with HTML template
 * @private
 */
function _renderTemplate() {
  const state = _getCartState.call(this);

  return hbsCart(state);
}

/**
 * Add eventListeners to buttons on modal window
 * @private
 */
function _assignEvents() {
  this._data.forEach((item) => {
    const itemId = item.id;
    const itemDecrease = $u.getElement('#CartItemDecrease' + itemId);
    const itemIncrease = $u.getElement('#CartItemIncrease' + itemId);
    const itemRemove = $u.getElement('#CartItemRemove' + itemId);

    itemDecrease.addEventListener('click', () => {
      this.decreaseItemAmount(itemId);
    });
    itemIncrease.addEventListener('click', () => {
      this.addToCart(item);
    });
    itemRemove.addEventListener('click', () => {
      this.removeFromCart(itemId);
    });
  });
}

/**
 * Update cart view
 * @private
 */
function _updateView() {
  const modal = $u.getElement('#modal');
  const cart = _renderTemplate.call(this);

  this._widjetData.innerHTML = this.getItemsCount();

  if (modal) {
    modalWindow.update(cart);

    _assignEvents.call(this);
  }
}

/**
 * Save _data to localStorage
 * @private
 */
function _saveState() {
  localStorage.setItem(this._widjetID, JSON.stringify(this._data));
}

/**
 * Load data from localStorage
 * @return {Array} Order items
 * @private
 */
function _loadState(id) {
  return JSON.parse(localStorage.getItem(id)) || [];
}

/**
 * Get current state
 * @return {Object} Current state
 * @private
 */
function _getCartState() {
  let total = 0;
  let counter = 0;
  let sum = 0;
  const order = [];

  this._data.forEach((item) => {
    counter++;
    sum = item.price * item.count;
    total += item.price * item.count;

    order.push(Object.assign({}, {
      number: counter,
      sum,
    },
    item));
  });

  return Object.assign({}, {order, total});
}

/**
 * Find item in array and return index or null
 * if item is not found
 * @param  {String} id Item id
 * @return {Number | null}    Item index or null, if not found
 * @private
 */
function _findItem(id) {
  let itemIndex = null;
  const hasOrderItem = this._data.some((item, index) => {
    itemIndex = index;
    return item.id === id;
  });

  return (hasOrderItem ? itemIndex : null);
}

/**
 * Polyfill for customEvent in IE9-11
 * @private
 */
function _customEventPolyfill() {
  try {
    const testEvent = new CustomEvent("IE has CustomEvent, but doesn't support constructor");
  } catch (error) {
    window.CustomEvent = function (event, params) {
      let evt;
      const evtParams = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, evtParams.bubbles, evtParams.cancelable, evtParams.detail);
      return evt;
    };

    CustomEvent.prototype = Object.create(window.Event.prototype);
  }
}

Cart.prototype = {
  /**
   * Add new item to cart or increase amout of existing one
   * @param  {String} id    ID
   * @param  {String} name  Item name
   * @param  {Number} price Item price
   * @public
   */
  addToCart(item) {
    let itemIndex = null;
    const orderItem = Object.assign({},
      item,
      {
        count: 1
      });

    itemIndex = _findItem.call(this, orderItem.id);

    if (itemIndex !== null) {
      this._data[itemIndex].count++;
    } else {
      this._data.push(orderItem);
    }

    document.dispatchEvent(this._events.stateChanged);
  },

  /**
   * Remove item from cart
   * @param  {Number} id Item id
   * @public
   */
  removeFromCart(id) {
    const itemIndex = _findItem.call(this, id);

    this._data.splice(itemIndex, 1);

    document.dispatchEvent(this._events.stateChanged);
  },

  /**
   * Decrease amout of item in cart
   * or completely delete it
   * @param  {Number} id Item id
   * @public
   */
  decreaseItemAmount(id) {
    const itemIndex = _findItem.call(this, id);

    if (itemIndex !== null) {
      if (this._data[itemIndex].count === 1) {
        this._data.splice(itemIndex, 1);
      } else {
        this._data[itemIndex].count -= 1;
      }

      document.dispatchEvent(this._events.stateChanged);
    }
  },

  /**
   * Get Cart items
   * @return {Array} Cart items
   * @public
   */
  getItems() {
    return this._data;
  },

  /**
   * Calculate total cost of cart's items
   * @return {String} Generated template
   * @public
   */
  getItemsCount() {
    return this._data.length;
  },

  /**
   * Show Cart modal
   * @public
   */
  showWindow() {
    const cart = _renderTemplate.call(this);

    modalWindow.open(cart);

    _assignEvents.call(this);
  },

  /**
   * Cart initialization
   * @public
   */
  init() {
    this._widjetObj = $u.getElement('#' + this._widjetID);
    this._widjetData = $u.getChild(this._widjetObj, '.cart-widjet__data');

    this._data = _loadState(this._widjetID);

    /**
     * Register events
     */
    _customEventPolyfill();

    this._events = {
      stateChanged: new CustomEvent('stateChanged' + this._widjetID, {
        detail: {name: 'stateChanged'}
      }),
    };

    document.addEventListener('stateChanged' + this._widjetID, () => {
      _saveState.call(this);
      _updateView.call(this);
    });
    /**
     * Events
     */

    document.dispatchEvent(this._events.stateChanged);

    this._widjetObj.addEventListener('click', () => {
      this.showWindow();
    });

    /** FOR DEVELOPMENT ONLY */
    $u.getJSON('/data/cartData.json', (itemsArray) => {
      const items = [];
      let flattenItems = [];
      itemsArray.forEach((item) => {
        items.push(item.items);
      });

      flattenItems = items.reduce((prev, cur) => {
        return prev.concat(cur);
      });

      flattenItems.forEach((item) => {
        const elementTitle = '#cartItemAdd' + item.id;
        const element = $u.getElement(elementTitle);
        if (element) {
          element.addEventListener('click', () => {
            this.addToCart(item);
          });
        }
      });
    });
    /** FOR DEVELOPMENT ONLY */
  },
};

export {
  /**
   * Cart constructor
   * @function
   */
  Cart,
};
