import { NextRequest, NextResponse } from "next/server";

// GET /api/tracking/script?siteId=xxx
// Serves the lightweight tracking JavaScript snippet
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId") || "default";

  // Determine the API base URL from the request
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const apiBase = `${proto}://${host}`;

  const script = `
(function() {
  'use strict';

  var SITE_ID = '${siteId}';
  var API_URL = '${apiBase}/api/tracking/events';
  var HEARTBEAT_INTERVAL = 5000;
  var BATCH_INTERVAL = 3000;
  var IDLE_TIMEOUT = 30000;

  // ── Visitor ID (persistent via localStorage) ──
  var STORAGE_KEY = '__wapzio_vid_' + SITE_ID;
  var visitorId;
  try {
    visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substr(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, visitorId);
    }
  } catch(e) {
    visitorId = 'v_anon_' + Math.random().toString(36).substr(2, 8);
  }

  // ── State ──
  var eventQueue = [];
  var activeTimeSeconds = 0;
  var lastTickTime = Date.now();
  var maxScrollDepth = 0;
  var lastActivityTime = Date.now();
  var isIdle = false;

  // ── Helpers ──
  function now() { return new Date().toISOString(); }

  function pushEvent(type, data) {
    eventQueue.push({ type: type, timestamp: now(), data: data || {} });
  }

  function flush() {
    if (eventQueue.length === 0) return;
    var payload = {
      siteId: SITE_ID,
      visitorId: visitorId,
      events: eventQueue.splice(0),
      meta: {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        page: location.pathname
      }
    };
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API_URL, JSON.stringify(payload));
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(payload));
      }
    } catch(e) { /* silent fail */ }
  }

  // ── Page View ──
  pushEvent('pageview', {
    page: location.pathname,
    title: document.title,
    url: location.href
  });

  // ── Passive Identity Capture (URL Sniffing) ──
  function sniffIdentity() {
    var params = new URLSearchParams(window.location.search);
    var identity = {};
    if (params.has('email')) identity.email = params.get('email');
    if (params.has('name')) identity.name = params.get('name');
    if (params.has('contact')) identity.email = params.get('contact');
    
    if (Object.keys(identity).length > 0) {
      window.wapzio.identify(identity);
    }
  }
  sniffIdentity();

  // ── Partial Form Capture (Drafts) ──
  document.addEventListener('blur', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      var val = e.target.value.trim();
      var name = e.target.name || e.target.id || '';
      
      // If it looks like an email, capture it immediately as identity
      if (val.includes('@') && val.includes('.') && val.length > 5) {
        window.wapzio.identify({ email: val });
      } else if (name.toLowerCase().includes('name') && val.length > 2) {
        // If it's a name field, update identity
        window.wapzio.identify({ name: val });
      }
    }
  }, true);

  // ── Click Tracking ──
  document.addEventListener('click', function(e) {
    var el = e.target;
    var tag = el.tagName || '';
    var text = (el.innerText || el.textContent || '').trim().substring(0, 80);
    var cls = (el.className || '').toString().substring(0, 100);
    var id = el.id || '';
    var href = el.href || el.closest('a')?.href || '';
    pushEvent('click', {
      tag: tag,
      text: text,
      className: cls,
      id: id,
      href: href,
      x: e.clientX,
      y: e.clientY
    });
    lastActivityTime = Date.now();
    isIdle = false;
  }, true);

  // ── Scroll Tracking ──
  var scrollTimeout = null;
  window.addEventListener('scroll', function() {
    lastActivityTime = Date.now();
    isIdle = false;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight
      );
      var winHeight = window.innerHeight;
      var depth = Math.round((scrollTop / (docHeight - winHeight)) * 100) || 0;
      if (depth > maxScrollDepth) {
        maxScrollDepth = depth;
        pushEvent('scroll', { depth: depth, scrollTop: scrollTop });
      }
    }, 150);
  }, { passive: true });

  // ── Mouse Activity ──
  var moveCount = 0;
  var moveInterval = null;
  document.addEventListener('mousemove', function() {
    moveCount++;
    lastActivityTime = Date.now();
    isIdle = false;
  }, { passive: true });

  moveInterval = setInterval(function() {
    if (moveCount > 0) {
      pushEvent('mousemove', { intensity: moveCount });
      moveCount = 0;
    }
  }, 10000);

  // ── Heartbeat (time on page) ──
  var heartbeatInterval = setInterval(function() {
    var nowMs = Date.now();
    
    // Only accumulate time if we are not idle and the tab is visible
    if (!isIdle && !document.hidden) {
      activeTimeSeconds += Math.round((nowMs - lastTickTime) / 1000);
    }
    lastTickTime = nowMs;

    pushEvent('heartbeat', {
      timeOnPage: activeTimeSeconds,
      scrollDepth: maxScrollDepth,
      idle: isIdle
    });

    // Idle detection
    if (nowMs - lastActivityTime > IDLE_TIMEOUT && !isIdle) {
      isIdle = true;
      pushEvent('idle', { afterSeconds: Math.round((nowMs - lastActivityTime) / 1000) });
    }
  }, HEARTBEAT_INTERVAL);

  // ── Focus / Blur ──
  document.addEventListener('visibilitychange', function() {
    var nowMs = Date.now();
    if (document.hidden) {
      // Accumulate remaining time before backgrounding
      if (!isIdle) {
        activeTimeSeconds += Math.round((nowMs - lastTickTime) / 1000);
      }
      pushEvent('blur', { timeOnPage: activeTimeSeconds });
      flush();
    } else {
      pushEvent('focus', {});
      lastActivityTime = nowMs;
      lastTickTime = nowMs; // Reset tick
      isIdle = false;
    }
  });

  // ── Batch send ──
  var batchInterval = setInterval(flush, BATCH_INTERVAL);

  // ── Page Leave ──
  window.addEventListener('beforeunload', function() {
    if (!isIdle && !document.hidden) {
      activeTimeSeconds += Math.round((Date.now() - lastTickTime) / 1000);
    }
    pushEvent('leave', {
      totalTime: activeTimeSeconds,
      scrollDepth: maxScrollDepth,
      page: location.pathname
    });
    flush();
  });

  // ── SPA Navigation (React Router, etc.) ──
  var lastPathname = location.pathname;
  var observer = new MutationObserver(function() {
    if (location.pathname !== lastPathname) {
      // Send leave for old page
      if (!isIdle && !document.hidden) {
        activeTimeSeconds += Math.round((Date.now() - lastTickTime) / 1000);
      }
      pushEvent('leave', {
        totalTime: activeTimeSeconds,
        scrollDepth: maxScrollDepth,
        page: lastPathname
      });
      // Reset for new page
      lastPathname = location.pathname;
      activeTimeSeconds = 0;
      lastTickTime = Date.now();
      lastActivityTime = Date.now();
      maxScrollDepth = 0;
      pushEvent('pageview', {
        page: location.pathname,
        title: document.title,
        url: location.href
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ── Public API ──
  window.wapzio = {
    identify: function(data) {
      if (!data || typeof data !== 'object') return;
      pushEvent('identify', data);
      flush();
    }
  };

})();
`;

  return new NextResponse(script.trim(), {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
