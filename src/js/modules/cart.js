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
  const $modalWrapper = $u.getElement('.modal__wrapper');

  $modalWrapper.addEventListener('click', (event) => {
    const eventTarget = event.target;
    const id = eventTarget.getAttribute('data-cartItemId');
    const action = eventTarget.getAttribute('data-cartActionType');

    if (!id) return;

    switch (action) {
      case 'itemDecrease':
        this.decreaseItemAmount(id);
        break;
      case 'itemIncrease':
        this.addToCart({id});
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

    /** FOR DEVELOPMENT ONLY */
    $u.getJSON('/data/cartData.json', (items) => {
      items.forEach((item) => {
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
