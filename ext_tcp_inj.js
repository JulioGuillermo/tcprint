// ==UserScript==
// @name         TC Better Print
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Inject the code to highlight the data
// @author       JG
// @match        *://tecnocasa-group.my.site.com/CRMImmobiliareLightning/apex/PrintableContent
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const BASE_URL = "http://localhost:3000";
  const SCRIPT_TO_INJECT_URL = `${BASE_URL}/print-logic.js`;
  const STYLE_TO_INJECT_URL = `${BASE_URL}/print-style.css`;

  function injectScript() {
    if (document.querySelector(`script[src="${SCRIPT_TO_INJECT_URL}"]`)) return;

    const cacheBuster = Date.now();

    const script = document.createElement("script");
    script.src = `${SCRIPT_TO_INJECT_URL}?v=${cacheBuster}`;
    //script.type = "module";
    document.body.appendChild(script);
    console.log(
      `[Injector] Secondary script injected: ${SCRIPT_TO_INJECT_URL}`,
    );
  }

  function injectStyle() {
    if (document.querySelector(`link[href="${STYLE_TO_INJECT_URL}"]`)) return;

    const cacheBuster = Date.now();

    const style = document.createElement("link");
    style.href = `${STYLE_TO_INJECT_URL}?v=${cacheBuster}`;
    style.rel = "stylesheet";
    style.type = "text/css";
    document.body.appendChild(style);
    console.log(`[Injector] Secondary style injected: ${STYLE_TO_INJECT_URL}`);
  }

  window.addEventListener("load", () => {
    injectScript();
    injectStyle();
  });
})();
