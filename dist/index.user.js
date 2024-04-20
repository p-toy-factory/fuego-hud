/*! For license information please see index.user.js.LICENSE.txt */
// ==UserScript==
// @name         FuegoHud
// @author       pinkchampagne
// @description  An overlay for monitoring FPS and Frametime on browser.
// @downloadURL  https://raw.githubusercontent.com/p-toy-factory/fuego-hud/main/dist/index.user.js
// @updateURL    https://raw.githubusercontent.com/p-toy-factory/fuego-hud/main/dist/index.user.js
// @grant        none
// @homepage     https://github.com/p-toy-factory/fuego-hud#readme
// @license      AGPL-3.0
// @match        *://*/*
// @supportURL   https://github.com/p-toy-factory/fuego-hud/issues
// @require      https://cdn.jsdelivr.net/npm/rxjs@7.8.0/dist/bundles/rxjs.umd.min.js
// @run-at       document-body
// @version      1.0.0
// ==/UserScript==
(() => {
  "use strict";
  class e {
    cleanups=[];
    add(e) {
      this.cleanups.unshift(e);
    }
    cleanup() {
      const e = this.cleanups;
      this.cleanups = [], e.forEach((e => e()));
    }
  }
  class n extends HTMLElement {
    cleanupsManager=new e;
    props;
    onCleanup(e) {
      this.cleanupsManager.add(e);
    }
    connectedCallback() {
      if (!this.props) throw new TypeError(`${this.nodeName}'s props is required`);
      const e = this.attachShadow({
        mode: "open"
      }), n = this.connectedCallbackWithProps(this.props);
      e.append(n);
    }
    disconnectedCallback() {
      this.cleanupsManager.cleanup();
    }
  }
  function t(e, n) {
    return customElements.define(e, n), function(n) {
      const t = document.createElement(e);
      return t.props = n, t;
    };
  }
  const s = t("fuego-graph", class extends n {
    connectedCallbackWithProps({data$: e, height: n, width: t}) {
      const s = document.createElement("canvas");
      s.height = n, s.width = t;
      const i = s.getContext("2d"), c = e.subscribe((e => {
        i.clearRect(0, 0, t, n), i.beginPath(), i.moveTo(0, n - e[0]);
        for (let t = 1, s = e.length; t < s; t++) {
          const s = t, c = Math.max(0, n - e[t]);
          i.lineTo(s, c);
        }
        i.stroke();
      }));
      return this.onCleanup((() => c.unsubscribe())), s;
    }
  }), i = rxjs, c = new i.Observable((e => {
    let n = 0, t = 0;
    const s = (0, i.animationFrames)().subscribe((({timestamp: s}) => {
      const i = Math.floor(s / 1e3);
      for (let s = 0; s < i - t; s++) e.next(n), n = 0, t = i;
      n++;
    }));
    return () => s.unsubscribe();
  }));
  let o, a = null, r = [];
  function u() {
    const e = performance.now(), n = e - o;
    o = e;
    for (let e = 0, t = r.length; e < t; e++) r[e](n);
    a = requestAnimationFrame(u);
  }
  function p() {
    o = performance.now(), a = requestAnimationFrame(u);
  }
  function l() {
    return 0 === r.length;
  }
  function d(e) {
    if ("function" != typeof e) throw TypeError("Expected the argument passed to subscribeFrametime to be a function");
    return l() && (a = requestAnimationFrame(p)), function(e) {
      r.push(e);
    }(e), function() {
      !function(e) {
        const n = r.indexOf(e);
        r.splice(n, 1);
      }(e), l() && (cancelAnimationFrame(a), a = null);
    };
  }
  const h = new i.Observable((e => d((n => e.next(n)))));
  function f(e, n) {
    return t => t.pipe((0, i.scan)(((n, t) => (n.length >= e && n.shift(), n.push(t), 
    n)), n?.slice() ?? []));
  }
  const m = t("reactive-element", class extends n {
    connectedCallbackWithProps({el: e, subscription: n}) {
      return this.onCleanup((() => n.unsubscribe())), e;
    }
  });
  function b(e, n, t) {
    const s = document.createElement(e), i = n.subscribe((e => t(s, e)));
    return m({
      el: s,
      subscription: i
    });
  }
  function g(e, n) {
    return e.append(...n), e;
  }
  !function() {
    const e = document.createElement("div");
    e.id = "fuego-hud", e.setAttribute("style", [ "position: fixed", "top: 0", "left: 0", "background: #ffffff7f", "pointer-events: none", "z-index: 114514" ].join("; "));
    const n = 180, t = new Array(n).fill(0), o = c.pipe(f(n, t)), a = s({
      data$: o,
      height: 60,
      width: n
    }), r = h.pipe(f(n, t)), u = s({
      data$: r,
      height: 50,
      width: n
    }), p = b("div", c.pipe((0, i.distinctUntilChanged)()), ((e, n) => {
      e.textContent = `Framerate: ${n}fps`;
    })), l = function() {
      const e = h.pipe((0, i.bufferTime)(1e3)), n = e.pipe((0, i.map)((e => (e.reduce(((e, n) => e + n), 0) / (e.length || 1)).toFixed(1))), (0, 
      i.distinctUntilChanged)()), t = e.pipe((0, i.map)((e => e.reduce(((e, n) => Math.max(e, n)), 0).toFixed(1))), (0, 
      i.distinctUntilChanged)());
      return b("div", (0, i.zip)(n, t), ((e, [n, t]) => {
        e.innerHTML = `Frametime: <sub>avg</sub>${n} / <sub>max</sub>${t} ms`;
      }));
    }();
    g(document.body, [ g(e, [ p, a, l, u ]) ]);
  }();
})();