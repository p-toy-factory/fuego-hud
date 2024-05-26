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
// @version      1.0.1
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
      const e = this.attachShadow({
        mode: "open"
      }), n = this.connectedCallbackWithProps(this.props);
      e.append(n);
    }
    disconnectedCallback() {
      this.cleanupsManager.cleanup();
    }
  }
  function t(e, t) {
    const s = `fuego-${e}`;
    // @ts-expect-error Can not be inferred
    return customElements.define(s, class extends n {
      connectedCallbackWithProps(e) {
        return t({
          props: e,
          onCleanup: this.onCleanup.bind(this)
        });
      }
    }), function(e) {
      const n = document.createElement(s);
      return n.props = e, n;
    };
  }
  const s = t("reactive-element", (({props: {data$: e, height: n, width: t}, onCleanup: s}) => {
    const c = document.createElement("canvas");
    c.height = n, c.width = t;
    const i = c.getContext("2d"), a = e.subscribe((e => {
      i.clearRect(0, 0, t, n), i.beginPath(), i.moveTo(0, n - e[0]);
      for (let t = 1, s = e.length; t < s; t++) {
        const s = t, c = Math.max(0, n - e[t]);
        i.lineTo(s, c);
      }
      i.stroke();
    }));
    return s((() => a.unsubscribe())), c;
  })), c = rxjs, i = new c.Observable((e => {
    let n = 0, t = 0;
    const s = (0, c.animationFrames)().subscribe((({timestamp: s}) => {
      const c = Math.floor(s / 1e3);
      for (let s = 0; s < c - t; s++) e.next(n), n = 0, t = c;
      n++;
    }));
    return () => s.unsubscribe();
  }));
  let a, o = null, r = [];
  function u() {
    const e = performance.now(), n = e - a;
    a = e;
    for (let e = 0, t = r.length; e < t; e++) r[e](n);
    o = requestAnimationFrame(u);
  }
  function l() {
    a = performance.now(), o = requestAnimationFrame(u);
  }
  function p() {
    return 0 === r.length;
  }
  function d(e) {
    if ("function" != typeof e) throw TypeError("Expected the argument passed to subscribeFrametime to be a function");
    return p() && (o = requestAnimationFrame(l)), function(e) {
      r.push(e);
    }(e), function() {
      !function(e) {
        const n = r.indexOf(e);
        r.splice(n, 1);
      }(e), p() && (cancelAnimationFrame(o), o = null);
    };
  }
  const m = new c.Observable((e => d((n => e.next(n)))));
  function h(e, n) {
    return t => t.pipe((0, c.scan)(((n, t) => (n.length >= e && n.shift(), n.push(t), 
    n)), n?.slice() ?? []));
  }
  const f = t("fps-text", (({onCleanup: e}) => {
    const n = document.createElement("div"), t = i.pipe((0, c.distinctUntilChanged)()).subscribe((e => {
      n.textContent = `Framerate: ${e}fps`;
    }));
    return e((() => t.unsubscribe())), n;
  }));
  function b(e, n) {
    return e.append(...n), e;
  }
  const g = m.pipe((0, c.bufferTime)(1e3)), x = t("avg-frametime", (({onCleanup: e}) => {
    const n = document.createElement("span"), t = g.pipe((0, c.map)((e => (e.reduce(((e, n) => e + n), 0) / (e.length || 1)).toFixed(1))), (0, 
    c.distinctUntilChanged)()).subscribe((e => {
      n.innerHTML = `Frametime: <sub>avg</sub>${e}`;
    }));
    return e((() => t.unsubscribe())), n;
  })), C = t("max-frametime", (({onCleanup: e}) => {
    const n = document.createElement("span"), t = g.pipe((0, c.map)((e => e.reduce(((e, n) => Math.max(e, n)), 0).toFixed(1))), (0, 
    c.distinctUntilChanged)()).subscribe((e => {
      n.innerHTML = `<sub>max</sub>${e} ms`;
    }));
    return e((() => t.unsubscribe())), n;
  }));
  !function() {
    const e = document.createElement("div");
    e.id = "fuego-hud", e.setAttribute("style", [ "position: fixed", "top: 0", "left: 0", "background: #ffffff7f", "pointer-events: none", "z-index: 114514" ].join("; "));
    const n = 180, t = new Array(n).fill(0), c = i.pipe(h(n, t)), a = s({
      data$: c,
      height: 60,
      width: n
    }), o = m.pipe(h(n, t)), r = s({
      data$: o,
      height: 50,
      width: n
    }), u = f(), l = b(document.createElement("div"), [ x(), document.createTextNode(" / "), C() ]);
    b(document.body, [ b(e, [ u, a, l, r ]) ]);
  }();
})();