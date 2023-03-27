/*! For license information please see index.user.js.LICENSE.txt */
// ==UserScript==
// @name         FuegoHud
// @author       pinkchampagne
// @description  An overlay for monitoring FPS and Frametime in browser.
// @downloadURL  https://raw.githubusercontent.com/p-toy-factory/fuego-hud/main/dist/index.user.js
// @updateURL    https://raw.githubusercontent.com/p-toy-factory/fuego-hud/main/dist/index.user.js
// @grant        none
// @homepage     https://github.com/p-toy-factory/fuego-hud#readme
// @license      AGPL-3.0
// @match        *://*/*
// @supportURL   https://github.com/p-toy-factory/fuego-hud/issues
// @require      https://cdn.jsdelivr.net/npm/rxjs@7.8.0/dist/bundles/rxjs.umd.min.js
// @run-at       document-body
// @version      0.1.14
// ==/UserScript==
(() => {
  "use strict";
  const e = rxjs;
  function t({data$: e, height: t, width: n}) {
    const i = document.createElement("canvas");
    i.setAttribute("width", String(n)), i.setAttribute("height", String(t));
    const o = i.getContext("2d"), {unsubscribe: r} = e.subscribe((e => {
      o.clearRect(0, 0, n, t), o.beginPath(), o.moveTo(0, t - e[0]);
      for (let n = 1, i = e.length; n < i; n++) {
        const i = n, r = Math.max(0, t - e[n]);
        o.lineTo(i, r);
      }
      o.stroke();
    }));
    return {
      el: i,
      cleanup: r
    };
  }
  function n() {
    return Math.floor(performance.now() / 1e3);
  }
  const i = new e.Observable((e => {
    let t = 0, i = 0, o = null;
    return i = n(), o = requestAnimationFrame((function o() {
      const r = n();
      r > i && (e.next(t), t = 0, i = r), t++, requestAnimationFrame(o);
    })), function() {
      cancelAnimationFrame(o), o = null;
    };
  }));
  let o, r = null, c = [];
  function a() {
    const e = performance.now(), t = e - o;
    o = e;
    for (let e = 0, n = c.length; e < n; e++) c[e](t);
    r = requestAnimationFrame(a);
  }
  function u() {
    o = performance.now(), r = requestAnimationFrame(a);
  }
  function s() {
    return 0 === c.length;
  }
  function l(e) {
    if ("function" != typeof e) throw TypeError("Expected the argument passed to subscribeFrametime to be a function");
    return s() && (r = requestAnimationFrame(u)), function(e) {
      c.push(e);
    }(e), function() {
      !function(e) {
        const t = c.indexOf(e);
        c.splice(t, 1);
      }(e), s() && (cancelAnimationFrame(r), r = null);
    };
  }
  const d = new e.Observable((e => l((t => e.next(t)))));
  function f(t, n) {
    return i => i.pipe((0, e.scan)(((e, n) => (e.length >= t && e.shift(), e.push(n), 
    e)), n?.slice() ?? []));
  }
  !function() {
    const n = document.createElement("div");
    n.id = "fuego-hud", n.setAttribute("style", [ "position: fixed", "top: 0", "left: 0", "background: #ffffff7f", "pointer-events: none", "z-index: 114514" ].join("; "));
    const o = document.createElement("div"), r = i.pipe((0, e.distinctUntilChanged)()).subscribe((e => {
      o.textContent = `Framerate: ${e}fps`;
    })), c = 180, a = new Array(c).fill(0), u = i.pipe(f(c, a)), {el: s, cleanup: l} = t({
      data$: u,
      height: 60,
      width: c
    }), p = document.createElement("div"), m = d.pipe((0, e.bufferTime)(1e3), (0, e.filter)((e => e.length > 0)), (0, 
    e.map)((e => (e.reduce(((e, t) => e + t), 0) / e.length).toFixed(1))), (0, e.distinctUntilChanged)()).subscribe((e => {
      p.textContent = `Frametime: ${e}ms`;
    })), h = d.pipe(f(c, a)), {el: b, cleanup: g} = t({
      data$: h,
      height: 50,
      width: c
    });
    document.body.appendChild(n), n.appendChild(o), n.appendChild(s), n.appendChild(p), 
    n.appendChild(b);
  }();
})();