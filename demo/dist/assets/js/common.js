/* jshint indent: 2 */
/* global document: true, window: true */
var as = {};

window.requestAnimationFrame = (function () {
  'use strict';

  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function (utils, undefined) {

  'use strict';

  Math.easeInOutQuad = function (currentTime, startValue, changeInValue, duration) {
    currentTime /= duration / 2;
    if (currentTime < 1) {
      return changeInValue / 2 * currentTime * currentTime + startValue;
    }
    currentTime--;
    return -changeInValue / 2 * (currentTime * (currentTime - 2) - 1) + startValue;
  };

  utils.addEvent = function ($elem, event, fn) {
    if ($elem.addEventListener) {
      $elem.addEventListener(event, fn, false);
    } else {
      $elem.attachEvent('on' + event, function () {
        return (fn.call($elem, window.event));
      });
    }
  };

  utils.addClass = function ($elem, klass) {
    if ($elem) {
      if ($elem.classList) {
        $elem.classList.add(klass);
      } else {
        $elem.setAttribute('class', $elem.getAttribute('class') + ' ' + klass);
      }
    }
  };

  utils.removeClass = function ($elem, klass) {
    if ($elem) {
      if ($elem.classList) {
        $elem.classList.remove(klass);
      } else {
        $elem.setAttribute('class', $elem.getAttribute('class').replace(klass, ''));
      }
    }
  };

  utils.hasClass = function ($elem, klass) {
    if ($elem) {
      return ($elem.classList) ? $elem.classList.contains(klass) : ($elem.getAttribute('class').indexOf(klass) > -1);
    }
  };

  utils.scrollTo = function (element, to, callback) {
    
    var DURATION = 400;
    var currentFrame = 0;
    var difference = 0;
    var increment = 10;
    var start = 0;

    var animateScroll = function () {
      var val = Math.easeInOutQuad(currentFrame, start, difference, DURATION);

      currentFrame += increment;
      element.scrollTop = val;
      
      if (currentFrame < DURATION) {
        window.requestAnimationFrame(animateScroll);
      } else {
        if (callback) {
          callback();
        }
      }
    };

    start = element.scrollTop;
    difference = to - start;

    animateScroll();
  };

} (as.utils = {}));

(function (navigation, undefined) {

  'use strict';

  var stickyEl = '.navigation',
      $originalEl,
      $header,
      headerOriginalHeight = 0,
      headerHeight = 0,
      $stickyEl;

  var handleScroll = function () {
    var windowScroll = window.scrollY;
    var offsetTop = $originalEl.offsetTop;

    if (windowScroll > offsetTop) {
      as.utils.addClass($stickyEl, 'visible');
      as.utils.removeClass($originalEl, 'visible');
    } else {
      as.utils.removeClass($stickyEl, 'visible');
      as.utils.addClass($originalEl, 'visible');
    }
  };

  var scrollToTop = function (e) {
    var $target = {};
    var $element = {};

    if (typeof e.target !== 'undefined') {
      $target = e.target;
    } else {
      $target = e.srcElement;
    }

    if ($target.href && $target.href.indexOf('#') > -1) {
      e.preventDefault();
      e.stopPropagation();

      $element = document.querySelector($target.href.slice($target.href.indexOf('#')));
      as.utils.scrollTo(document.documentElement, $element.offsetTop);
    }
  };

  var initNav = function () {
    $originalEl = document.querySelector(stickyEl);
    $stickyEl = $originalEl.cloneNode(true);
    $header = document.querySelector('.header');

    as.utils.removeClass($stickyEl, 'visible');
    as.utils.addClass($stickyEl, 'float');
    headerOriginalHeight = $header.clientHeight;
    headerHeight = headerOriginalHeight;
    $originalEl.parentNode.appendChild($stickyEl);
  };

  var initEvents = function () {
    var i = 0;
    var l = 0;
    var $backToTop = document.querySelectorAll('.top');

    as.utils.addEvent(window, 'scroll', handleScroll);
    for (i = 0, l = $backToTop.length; i < l; i ++) {
      //as.utils.addEvent($backToTop[i], 'click', scrollToTop);
    }
  };

  navigation.init = function () {
    initNav();
    initEvents();
  };

} (as.navigation = {}));

(function (overlay, undefined) {

  'use strict';

  var $overlay;
  var $overlayInner;
  var $veil;

  overlay.trigger = function ($elem) {
    
    $overlayInner.innerHTML = '';

    if ($elem.nodeName === 'IMG') {
      if ($elem.parentElement.nodeName === 'A') {
        $overlayInner.innerHTML = '<img src="' + $elem.parentElement.href + '" />';
      } else {
        $overlayInner.appendChild($elem.cloneNode());
      }
      overlay.show();
    } else if ($elem.nodeName === 'DIV' || $elem.nodeName === 'A') {
      if ($elem.getAttribute('data-action') === 'close') {
        overlay.close();
      }
    }
  };

  overlay.show = function () {
    as.utils.removeClass($overlay, 'hidden');
    as.utils.removeClass($veil, 'hidden');
  };

  overlay.close = function () {
    as.utils.addClass($overlay, 'hidden');
    as.utils.addClass($veil, 'hidden');
  };

  overlay.init = function () {
    $overlay = document.querySelector('.overlay');
    $overlayInner = $overlay.querySelector('.overlay-inner');
    $veil = document.querySelector('.veil');
  };


}(as.overlay = {}));

(function () {
  'use strict';

  var welcome = function () {
    if (window.console) {
      console.log('\n\n' +
        ' aaaaa  nn   nn dddddd  iiii    ssss   m   m   iiii tttttt hh   hh \n' +
        'aa   aa nnn  nn dd   dd  ii    ss     mm m mm   ii    tt   hh   hh \n' +
        'aaaaaaa nn n nn dd   dd  ii     sss   m  m  m   ii    tt   hhhhhhh \n' +
        'aa   aa nn  nnn dd   dd  ii       ss mm     mm  ii    tt   hh   hh \n' +
        'aa   aa nn   nn dddddd  iiii   ssss  mm     mm iiii   tt   hh   hh \n\n' +
        'andismith.com - (c) ' + new Date().getFullYear() + ' Andi Smith\n\n' +
        'Thank you for visiting, and thanks for taking a look at the code!!\n\n');
    }
  };

  var handleClickEvents = function () {
    as.utils.addEvent(document, 'click', function (e) {

      var action = '';
      var offsetTop;
      var windowScroll = window.scrollY;
      var $target;

      if (typeof e.target !== 'undefined') {
        $target = e.target;
      } else {
        $target = e.srcElement;
      }

      if ($target.nodeName !== 'A' && $target.parentElement.nodeName === 'A') {
        $target = $target.parentElement;
      }

      action = $target.getAttribute('data-feature');

      if (action && as[action] && as[action].trigger) {
        e.preventDefault();
        as[action].trigger(e.target);
      } /*else if ($target.nodeName === 'A') {
        offsetTop = document.querySelector('.navigation').offsetTop - document.querySelector('.header').clientHeight;

        if (windowScroll < offsetTop) {
          e.preventDefault();

          as.utils.scrollTo(document.documentElement, offsetTop, function () {
            window.location.href = $target.href;
          });
        }
      }*/
    });
  };

  welcome();
  handleClickEvents();
  as.navigation.init();
  as.overlay.init();
}());