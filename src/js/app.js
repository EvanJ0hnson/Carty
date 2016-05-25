'use strict';

import {Cart} from './modules/cart';
import hljs from 'highlight.js/lib/highlight.js';
import {toggleNavigationBar} from './modules/toggleNavigation';

/**
 * Application entry point
 */
const initApp = () => {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-59739314-4', 'auto');
  ga('send', 'pageview');

  toggleNavigationBar();

  const cartInstance = new Cart('cart-widget');
  cartInstance.init();

  hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
  hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
  hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
  hljs.initHighlighting();
};

/**
 * Initialization
 */
document.addEventListener('DOMContentLoaded', initApp);
