// ==UserScript==
// @name         TC Better Print
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Inject the code to highlight the data
// @author       JG
// @match        *://tecnocasa-group.my.site.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
//
// @ts-check

(function () {
  "use strict";

  const SCRIPT_TO_INJECT_URL = "http://localhost:3000/print-logic.js";

  /**
   * @param {Document} iframeDoc
   */
  function injectScript(iframeDoc) {
    if (iframeDoc.querySelector(`script[src="${SCRIPT_TO_INJECT_URL}"]`))
      return;

    const script = iframeDoc.createElement("script");
    script.src = SCRIPT_TO_INJECT_URL;
    script.type = "text/javascript";
    iframeDoc.head.appendChild(script);
    console.log(
      `[Injector] Secondary script injected: ${SCRIPT_TO_INJECT_URL}`,
    );
  }

  /**
   * @param {HTMLIFrameElement} iframe
   */
  function processIframe(iframe) {
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc?.readyState === "complete") {
      injectScript(doc);
      return;
    }

    iframe.onload = () => {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) injectScript(doc);
    };
  }

  /**
   * @param {MutationRecord} mutation
   */
  function processMutation(mutation) {
    if (mutation.type !== "childList") return;

    mutation.addedNodes.forEach((node) => {
      if (!(node instanceof HTMLIFrameElement)) return;

      if (
        node.tagName !== "IFRAME" ||
        !node.src ||
        !node.src.includes("PrintableContent")
      )
        return;

      processIframe(node);
    });
  }

  function startIframeObserver() {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) processMutation(mutation);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("[Injector] Observer started on the main DOM.");
  }

  startIframeObserver();
})();
