// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/components/search/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setState = exports.state = void 0;
const state = {
  searchTerm: null,
  searchBy: null,
  drinks: null,
  currentDrink: null
};
exports.state = state;

const setState = (toSet, newValue) => {
  state[toSet] = newValue;
};

exports.setState = setState;
},{}],"src/data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDrinksByName = fetchDrinksByName;
exports.fetchDrinksByIngredient = fetchDrinksByIngredient;

var _state = require("./state");

function fetchDrinksByName() {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${_state.state.searchTerm}`;
  return fetch(url).then(res => res.json()).then(data => data.drinks).catch(error => console.error(error));
}

function fetchDrinksByIngredient() {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${_state.state.searchTerm}`;
  return fetch(url).then(res => res.json()).then(data => data.drinks).catch(error => console.error(error));
}
},{"./state":"src/state.js"}],"src/components/modal/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/components/modal/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modal = modal;
exports.open = open;

var _state = require("../../state");

require("./index.css");

function modal() {
  let markup = `
    <div id="overlay">
        <div id="modal">
            <article>
                <h3></h3>
                <img src="" alt="" />
                <h5>Ingredients</h5>
                <ul class="ingredients"></ul>
                <h5>Instructions</h5>
                <p class="instructions"></p>
            </article>
            <button id="close" href="#">X</button>
        </div>
    </div>
    `;
  return markup;
}

function updateModalContent() {
  const drink = _state.state.drinks[_state.state.currentDrink];
  console.log(drink);
  const title = drink.strDrink;
  const url = drink.strDrinkThumb;
  const ingredients = [];
  let ingredientsMarkup = ``;
  const instructions = drink.strInstructions; // There are 15 objects to store ingredients in the json. Loop through.

  for (let i = 1; i <= 15; i++) {
    const prop = `strIngredient` + i;

    if (null === drink[prop]) {
      break;
    }

    ingredients.push(drink[prop]);
  }

  for (const ingredient of ingredients) {
    console.log(`${ingredient}`);
    ingredientsMarkup += `<li>${ingredient}</li>`;
  } //console.log(ingredients);


  const titleEl = document.querySelector(`#modal h3`);
  const imageEl = document.querySelector(`#modal img`);
  const ingredientsEl = document.querySelector(`#modal .ingredients`);
  const instructionsEl = document.querySelector(`#modal .instructions`);
  titleEl.innerHTML = title;
  imageEl.src = url;
  imageEl.alt = title;
  ingredientsEl.innerHTML = ingredientsMarkup;
  instructionsEl.innerHTML = instructions;
}

function open() {
  const container = document.querySelector(`#app`);
  container.insertAdjacentHTML("beforeend", modal());
  updateModalContent();
  init();
}

function close() {
  const overlay = document.querySelector(`#overlay`);
  overlay.remove();
}

function init() {
  const closeBtn = document.querySelector(`#modal #close`);
  closeBtn.addEventListener(`click`, close);
  const overlay = document.querySelector(`#overlay`);
  overlay.addEventListener(`click`, handleCloseClick);
  document.addEventListener("keyup", handleKeys);
}

function handleCloseClick(event) {
  if (event.target.id == "overlay") {
    close();
  }
}

function handleKeys(event) {
  if (event.key === "Escape") close();
}
},{"../../state":"src/state.js","./index.css":"src/components/modal/index.css"}],"src/components/lightbox/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/components/lightbox/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lightbox;
exports.init = init;
exports.clearLightbox = clearLightbox;

var _state = require("../../state");

var _modal = require("../modal");

require("./index.css");

function lightbox() {
  let markup = `<div class="lightbox">`;

  _state.state.drinks.forEach(drink => {
    const url = drink.strDrinkThumb;
    const title = drink.strDrink;
    markup += `<div class="thumbnail">
            <div class="img-container">
                <img src="${url}" alt="${title}" />
            </div>
            <h6>${title}</h6>
        </div>`;
  });

  markup += `</div>`;
  return markup;
}

function init() {
  const drinks = Array.from(document.querySelectorAll(`.lightbox img`));
  drinks.forEach(drink => {
    drink.addEventListener(`click`, openLightbox);
  });
}

function openLightbox(e) {
  e.preventDefault();
  const currentDrinkIndex = getCurrentDrinkIndex(event.target);
  (0, _state.setState)(`currentDrink`, currentDrinkIndex);
  console.log(_state.state.currentDrink);
  (0, _modal.open)();
}

function getCurrentDrinkIndex(drink) {
  const drinks = Array.from(document.querySelectorAll(`.lightbox img`));
  let currentDrinkIndex = drinks.map(img => img.outerHTML).findIndex(img => img == drink.outerHTML);
  return currentDrinkIndex;
}

function clearLightbox() {
  const lightbox = document.querySelector(`.lightbox`);
  if (lightbox) lightbox.remove();
}
},{"../../state":"src/state.js","../modal":"src/components/modal/index.js","./index.css":"src/components/lightbox/index.css"}],"src/components/search/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.default = search;

require("./index.css");

var _state = require("../../state");

var _data = require("../../data");

var _lightbox = _interopRequireWildcard(require("../lightbox"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function init() {
  const search = document.getElementById(`search`);
  search.addEventListener(`submit`, doSearch);
}

function search() {
  return `
        <h1>Find Your Cocktail 🍸</h1>
        <form name="search" id="search">
            <input id="search-field" name="search-term" type="search" placeholder="Search here..." />
            <select id="search-select" name="search-type">
                <option value="name">By Cocktail Name</option>
                <option value="ingredient">By Ingredient</option>
            </select>
            <input class="button-primary" type="submit" id="submit" value="Search Cocktails" />
        </form>
    `;
}

async function doSearch(e) {
  e.preventDefault();
  (0, _lightbox.clearLightbox)();
  clearNoResults();
  const term = document.getElementById(`search-field`).value.toLowerCase();
  const type = document.getElementById(`search-select`).value.toLowerCase();
  (0, _state.setState)(`searchTerm`, term);
  (0, _state.setState)(`searchBy`, type);
  let drinks = {};

  if (`name` === type) {
    drinks = await (0, _data.fetchDrinksByName)();
  } else {
    drinks = await (0, _data.fetchDrinksByIngredient)();
  }

  (0, _state.setState)(`drinks`, drinks);

  if (_state.state.drinks === null || _state.state.drinks === undefined) {
    const markup = `<h4 class="no-results">There are no results for <strong>${_state.state.searchTerm}</strong> when searching for cocktails by ${_state.state.searchBy}.</h4>`;
    document.getElementById(`app`).insertAdjacentHTML(`beforeend`, markup);
    (0, _state.setState)(`searchTerm`, null);
    document.getElementById(`search-field`).value = _state.state.searchTerm;
  } else {
    const markup = (0, _lightbox.default)();
    document.getElementById(`app`).insertAdjacentHTML(`beforeend`, markup);
    (0, _lightbox.init)();
  }
}

function clearNoResults() {
  const noResults = document.querySelector(`.no-results`);
  if (noResults) noResults.remove();
}
},{"./index.css":"src/components/search/index.css","../../state":"src/state.js","../../data":"src/data.js","../lightbox":"src/components/lightbox/index.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

require("./index.css");

var _search = _interopRequireWildcard(require("./components/search"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function init() {
  let markup = (0, _search.default)();
  document.getElementById(`app`).insertAdjacentHTML(`beforeend`, markup);
  (0, _search.init)();
}

init();
},{"./index.css":"src/index.css","./components/search":"src/components/search/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49637" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map