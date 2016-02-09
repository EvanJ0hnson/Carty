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
  this._events = {
    stateChanged: new CustomEvent('stateChanged' + this._widjetID, {detail: ''}),
  };
}

/**
 * Render Handlebars template
 * @return {String} String with HTML template
 * @private
 */
function _renderTemplate() {
  let total = 0;
  let counter = 0;
  const order = [];

  this._data.forEach((item) => {
    const orderItem = {};
    counter++;

    orderItem.id = item.id;
    orderItem.number = counter;
    orderItem.name = item.name;
    orderItem.price = item.price;
    orderItem.count = item.num;
    orderItem.sum = item.price * item.num;

    total += orderItem.sum;

    order.push(orderItem);
  });

  return hbsCart({order, total});
}

/**
 * Add eventListeners to buttons on modal window
 * @private
 */
function _assignEvents() {
  const obj = this;

  obj._data.forEach((item) => {
    const itemId = item.id;
    const itemDecrease = $u.getElement('#CartItemDecrease' + itemId);
    const itemIncrease = $u.getElement('#CartItemIncrease' + itemId);
    const itemRemove = $u.getElement('#CartItemRemove' + itemId);

    itemDecrease.addEventListener('click', () => {
      obj.decreaseItemAmount(itemId);
    });
    itemIncrease.addEventListener('click', () => {
      obj.addToCart(itemId);
    });
    itemRemove.addEventListener('click', () => {
      obj.removeFromCart(itemId);
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

Cart.prototype = {
  /**
   * Add new item to cart or increase amout of existing one
   * @param  {String} id    ID
   * @param  {String} name  Item name
   * @param  {Number} price Item price
   * @public
   */
  addToCart(id, name, price) {
    let itemIndex = null;
    const orderItem = {
      id,
      name,
      price,
      num: 1,
    };

    itemIndex = _findItem.call(this, id);

    if (itemIndex !== null) {
      this._data[itemIndex].num++;
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
      if (this._data[itemIndex].num === 1) {
        this._data.splice(itemIndex, 1);
      } else {
        this._data[itemIndex].num -= 1;
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

    this._widjetObj.addEventListener('click', () => {
      this.showWindow();
    });

    document.addEventListener('stateChanged' + this._widjetID, () => {
      _saveState.call(this);
      _updateView.call(this);
    });

    document.dispatchEvent(this._events.stateChanged);

    /** Test related events */
    $u.getElement('#cartItemAdd001').addEventListener('click', () => {
      this.addToCart('001', 'Салат «Грибы с сыром»', 130);
    });

    $u.getElement('#cartItemAdd002').addEventListener('click', () => {
      this.addToCart('002', 'Просто салат обычный', 150);
    });

    $u.getElement('#cartItemAdd003').addEventListener('click', () => {
      this.addToCart('003', 'Просто салат обычный', 150);
    });
  },
};

export {
  /**
   * Cart constructor
   * @function
   */
  Cart,
};
