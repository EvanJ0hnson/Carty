/**
 * @module modules/cart
 */
import * as modalWindow from './modal';
import * as $u from './utilites';

import hbsCart from '../../templates/cart.hbs';
import hbsCartItem from '../../templates/cartItem.hbs';

/**
 * Cart constructor
 * @param  {String} id Object Id
 * @constructor
 * @public
 */
function Cart(id) {
  this._coreData = null;

  /**
   * Cart items
   * @type {Array}
   * @private
   */
  this._data = null;

  /**
   * Object that contains Cart widget
   * @type {DOM Node}
   * @private
   */
  this._widgetObj = null;

  /**
   * Object that contains Cart widget data
   * @type {DOM Node}
   * @private
   */
  this._widgetData = null;

  /**
   * ID of the widget object
   * @type {String}
   * @private
   */
  this._widgetID = id;

  /**
   * Cart events
   * @type {Object}
   * @private
   */
  this._events = null;
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

  total = total.toFixed(2);

  return Object.assign({}, {order, total});
}

/**
 * Render Handlebars template: Cart
 * @return {String} String with HTML template
 * @private
 */
function _renderTemplate() {
  const state = _getCartState.call(this);

  return hbsCart(state);
}

/**
 * Render Handlebars template: Cart Items
 * @return {String} String with HTML template
 * @private
 */
function _renderCartItems() {
  const coreData = this._coreData;
  const $cartItems = $u.getElement('.cart-items');
  const hbsCartItems = hbsCartItem(Object.assign({}, {coreData}));

  $u.appendString($cartItems, hbsCartItems);
}

/**
 * Add eventListeners to buttons on modal window
 * @private
 */
function _assignEvents() {
  const $body = $u.getElement('body');

  $body.addEventListener('click', (event) => {
    const eventTarget = event.target;
    const id = eventTarget.getAttribute('data-cartItemId');
    const action = eventTarget.getAttribute('data-cartActionType');

    if (!id) return;

    switch (action) {
      case 'itemDecrease':
        this.decreaseItemAmount(id);
        break;
      case 'itemIncrease':
        this.increaseItemAmount(id);
        break;
      case 'itemAdd':
        this.addToCart(id);
        break;
      case 'itemRemove':
        this.removeFromCart(id);
        break;
      default:
        break;
    }
  });
}

/**
 * Get _coreData item by id
 * @return {Object} Cart item
 * @private
 */
function _getItem(id) {
  let requestedItem = null;
  const hasItem = this._coreData.some((item) => {
    requestedItem = item;
    return item.id === id;
  });

  return (hasItem ? requestedItem : null);
}

/**
 * Update cart view
 * @private
 */
function _updateView() {
  const modal = $u.getElement('#modal');
  const cart = _renderTemplate.call(this);

  this._widgetData.innerHTML = this.getItemsCount();

  if (modal) {
    modalWindow.update(cart);
  }
}

/**
 * Save _data to localStorage
 * @private
 */
function _saveState() {
  localStorage.setItem(this._widgetID, JSON.stringify(this._data));
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
 * Find item in array and return index or null
 * if item is not found
 * @param  {String} id Item id
 * @return {Number | null}    Item index or null, if not found
 * @private
 */
function _getItemIndex(id) {
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
   * Add new item to cart
   * @param  {String} id    ID
   * @public
   */
  addToCart(id) {
    let itemIndex = null;
    const itemData = _getItem.call(this, id);
    const item = Object.assign({},
      itemData,
      {
        count: 1
      });

    itemIndex = _getItemIndex.call(this, id);

    if (itemIndex === null) {
      this._data.push(item);
      document.dispatchEvent(this._events.stateChanged);
    }
  },

  /**
   * Remove item from cart
   * @param  {Number} id Item id
   * @public
   */
  removeFromCart(id) {
    const itemIndex = _getItemIndex.call(this, id);

    this._data.splice(itemIndex, 1);

    document.dispatchEvent(this._events.stateChanged);
  },

  /**
   * Increase amout of target item
   * @param  {String} id    ID
   * @public
   */
  increaseItemAmount(id) {
    let itemIndex = null;

    itemIndex = _getItemIndex.call(this, id);

    this._data[itemIndex].count++;

    document.dispatchEvent(this._events.stateChanged);
  },

  /**
   * Decrease amout of item in cart
   * or completely delete it
   * @param  {Number} id Item id
   * @public
   */
  decreaseItemAmount(id) {
    const itemIndex = _getItemIndex.call(this, id);

    if (this._data[itemIndex].count > 1) {
      this._data[itemIndex].count -= 1;
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
  },

  /**
   * Cart initialization
   * @public
   */
  init() {
    this._widgetObj = $u.getElement('#' + this._widgetID);
    this._widgetData = $u.getChild(this._widgetObj, '.cart-widget__data');

    this._data = _loadState(this._widgetID);

    this._events = {
      stateChanged: new CustomEvent('stateChanged' + this._widgetID, {
        detail: {name: 'stateChanged'}
      }),
    };

    /**
     * Register events
     */
    _customEventPolyfill();
    _assignEvents.call(this);

    document.addEventListener('stateChanged' + this._widgetID, () => {
      _saveState.call(this);
      _updateView.call(this);
    });

    this._widgetObj.addEventListener('click', () => {
      this.showWindow();
    });

    document.dispatchEvent(this._events.stateChanged);
    /**
     * Events
     */

    /**
     * Load core data
     * (temporary init solution)
     * (need to check if new version is available)
     */
    this._coreData = JSON.parse(localStorage.getItem('hmpCoreData')) || [];

    if (this._coreData.length) {
      _renderCartItems.call(this);
    } else {
      $u.getJSON('/data/cartData.json', (items) => {
        this._coreData = items;

        _renderCartItems.call(this);

        localStorage.setItem('hmpCoreData', JSON.stringify(items));
      });
    }
    /**
     * Load core data
     */
  },
};

export {
  /**
   * Cart constructor
   * @function
   */
  Cart,
};
