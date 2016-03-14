'use strict';

import {Cart} from './modules/cart';
import hljs from 'highlight.js';

/**
 * Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  const currentState = window.location.pathname;
  switch (currentState) {
    case '/':
      const cartInstance = new Cart('cart-widjet');
      cartInstance.init();
      hljs.initHighlighting();
      break;
    default:
      console.log('Error: missing state');
      break;
  }
});
