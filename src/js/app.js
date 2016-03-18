'use strict';

import {Cart} from './modules/cart';
import hljs from 'highlight.js';
import {toggleNavigationBar} from './modules/toggleNavigation';

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
      toggleNavigationBar();
      break;
    default:
      console.log('Error: missing state');
      break;
  }
});
