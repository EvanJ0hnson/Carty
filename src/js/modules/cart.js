import * as modalWindow from './modal';
import * as _u from './utilites';

import hbsCart from '../../templates/cart.hbs';

/**
 * Cart module
 * @param  {String} id Object Id
 */
export default function VTCart(cartId) {
  let _data = null;
  let _widjetObj = null;
  let _widjetData = null;
  const _widjetID = cartId;
  const _events = {
    stateChanged: new CustomEvent('stateChanged' + _widjetID, {detail: ''}),
  };
  let publicExport = {};

  /**
   * Calculate total cost of cart's items
   * @return {String} Generated template
   */
  function _getItemsCount() {
    return (_data.length);
  }

  /**
   * Render Handlebars template
   * @return {String} String with HTML template
   */
  function _renderTemplate() {
    let total = 0;
    let counter = 0;
    const order = [];

    _data.forEach((item) => {
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
   */
  function _assignEvents() {
    _data.forEach((item) => {
      const itemId = item.id;
      const itemDecrease = _u.getElement('#vtCartItemDecrease' + itemId);
      const itemIncrease = _u.getElement('#vtCartItemIncrease' + itemId);
      const itemRemove = _u.getElement('#vtCartItemRemove' + itemId);

      itemDecrease.addEventListener('click', () => {
        decreaseItemAmount(itemId);
      });
      itemIncrease.addEventListener('click', () => {
        addToCart(itemId);
      });
      itemRemove.addEventListener('click', () => {
        removeFromCart(itemId);
      });
    });
  }

  /**
   * Update cart view
   */
  function _updateView() {
    const modal = _u.getElement('#modal');
    const cart = _renderTemplate();

    _widjetData.innerHTML = _getItemsCount();

    if (modal) {
      modalWindow.update(cart);

      _assignEvents();
    }
  }

  /**
   * Save _data to localStorage
   */
  function _saveState() {
    localStorage.setItem(_widjetID, JSON.stringify(_data));
  }

  /**
   * Load data from localStorage
   * @return {Array} Order items
   */
  function _loadState(id) {
    return JSON.parse(localStorage.getItem(id)) || [];
  }

  /**
   * Find item in array and return index or null
   * if item is not found
   * @param  {String} id Item id
   * @return {Number : null}    Item index or null, if not found
   */
  function _findItem(id) {
    let itemIndex = null;
    const hasOrderItem = _data.some((item, index) => {
      itemIndex = index;
      return item.id === id;
    });

    return (hasOrderItem ? itemIndex : null);
  }

  /**
   * Add new item to cart or increase amout of existing one
   * @param  {String} id    ID
   * @param  {String} name  Item name
   * @param  {Number} price Item price
   */
  function addToCart(id, name, price) {
    let itemIndex = null;
    const orderItem = {
      id,
      name,
      price,
      num: 1,
    };

    itemIndex = _findItem(id);

    if (itemIndex !== null) {
      _data[itemIndex].num++;
    } else {
      _data.push(orderItem);
    }

    document.dispatchEvent(_events.stateChanged);
  }

  /**
   * Remove item from cart
   * @param  {Number} id Item id
   */
  function removeFromCart(id) {
    const itemIndex = _findItem(id);

    _data.splice(itemIndex, 1);

    document.dispatchEvent(_events.stateChanged);
  }

  /**
   * Decrease amout of item in cart
   * or completely delete it
   * @param  {Number} id Item id
   */
  function decreaseItemAmount(id) {
    const itemIndex = _findItem(id);

    if (itemIndex !== null) {
      if (_data[itemIndex].num === 1) {
        _data.splice(itemIndex, 1);
      } else {
        _data[itemIndex].num -= 1;
      }

      document.dispatchEvent(_events.stateChanged);
    }
  }

  /**
   * Get Cart items
   * @return {Array} Cart items
   */
  function getItems() {
    return _data;
  }

  /**
   * Show Cart modal
   */
  function _showWindow() {
    const cart = _renderTemplate();

    modalWindow.open(cart);

    _assignEvents();
  }

  /**
   * Object initialization
   */
  (function init() {
    _widjetObj = _u.getElement('#' + _widjetID);
    _widjetData = _widjetObj.querySelector('.cart-widjet__data');

    _data = _loadState(_widjetID);

    _widjetObj.addEventListener('click', () => {
      _showWindow();
    });

    document.addEventListener('stateChanged' + _widjetID, () => {
      _updateView();
      _getItemsCount();
      _saveState();
    });

    document.dispatchEvent(_events.stateChanged);

    /** Test related events */
    _u.getElement('#vtCartItemAdd001').addEventListener('click', () => {
      addToCart('001', 'Салат «Грибы с сыром»', 130);
    });

    _u.getElement('#vtCartItemAdd002').addEventListener('click', () => {
      addToCart('002', 'Просто салат обычный', 150);
    });

    _u.getElement('#vtCartItemAdd003').addEventListener('click', () => {
      addToCart('003', 'Просто салат обычный', 150);
    });
  }());

  publicExport = {
    getItems,
    decreaseItemAmount,
    removeFromCart,
    addToCart,
  };

  return publicExport;
}
