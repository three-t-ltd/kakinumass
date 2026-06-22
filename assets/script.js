/* KAKINUMA SEISAKUSHO — interactions */
(function () {
  "use strict";
  var doc = document;

  /* ---------- Header scroll state ---------- */
  var header = doc.querySelector(".site-header");
  var progress = doc.querySelector(".scroll-progress");
  function onScroll() {
    var y = window.scrollY || doc.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (progress) {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = doc.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      doc.body.classList.toggle("nav-open");
    });
    doc.querySelectorAll(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        doc.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-dec") | 0);
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = dec ? val.toFixed(dec) : Math.floor(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? target.toFixed(dec) : target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  var counters = doc.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var io2 = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); io2.unobserve(e.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { io2.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Works filter ---------- */
  var filterBtns = doc.querySelectorAll(".work-filter button");
  var workCards = doc.querySelectorAll(".work-grid .work-card");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      workCards.forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-cat") === f;
        c.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------- Smooth anchor (same-page) ---------- */
  doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var t = doc.querySelector(id);
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }
    });
  });

  /* ---------- Contact form (no backend) ---------- */
  var form = doc.querySelector(".form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector(".submit");
      if (btn) { btn.textContent = "送信ありがとうございます"; btn.style.background = "#121212"; }
      alert("お問い合わせありがとうございます。\n（このフォームはデモです。公開時にメール送信／Formspree等を接続します）");
    });
  }

  /* ---------- YouTube click-to-play facade ---------- */
  doc.querySelectorAll(".video-facade").forEach(function (f) {
    f.addEventListener("click", function () {
      var id = f.getAttribute("data-yt");
      if (!id) return;
      var iframe = doc.createElement("iframe");
      iframe.setAttribute("src", "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1");
      iframe.setAttribute("title", "会社紹介ムービー");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "");
      f.parentNode.appendChild(iframe);
      f.remove();
    });
  });

  /* ---------- Process videos: play when in view ---------- */
  var dvVideos = doc.querySelectorAll(".dv-media");
  if (dvVideos.length) {
    dvVideos.forEach(function (v) { v.muted = true; v.setAttribute("muted", ""); });
    if ("IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.play().catch(function () {}); }
          else { e.target.pause(); }
        });
      }, { threshold: 0.25 });
      dvVideos.forEach(function (v) { vio.observe(v); });
    } else {
      dvVideos.forEach(function (v) { v.play().catch(function () {}); });
    }
  }

  /* ---------- Hero background video cover-fill ---------- */
  function coverHeroVideo() {
    var box = doc.querySelector(".hero-video-bg");
    if (!box || getComputedStyle(box).display === "none") return;
    var ifr = box.querySelector("iframe");
    if (!ifr) return;
    var w = box.clientWidth, h = box.clientHeight, r = 16 / 9, cw, ch;
    if (w / h < r) { ch = h; cw = h * r; } else { cw = w; ch = w / r; }
    ifr.style.width = Math.ceil(cw) + "px";
    ifr.style.height = Math.ceil(ch) + "px";
    ifr.style.left = Math.round((w - cw) / 2) + "px";
    ifr.style.top = Math.round((h - ch) / 2) + "px";
  }
  if (doc.querySelector(".hero-video-bg")) {
    coverHeroVideo();
    window.addEventListener("resize", coverHeroVideo, { passive: true });
    window.addEventListener("load", coverHeroVideo);
  }

  /* ---------- SnapWidget responsive scaling ---------- */
  function scaleSnapWidget() {
    doc.querySelectorAll(".sw-frame").forEach(function (fr) {
      var ifr = fr.querySelector("iframe");
      if (!ifr) return;
      var natW = parseFloat(ifr.getAttribute("data-w")) || 765;
      var natH = parseFloat(ifr.getAttribute("data-h")) || 690;
      var scale = Math.min(1, fr.clientWidth / natW);
      ifr.style.width = natW + "px";
      ifr.style.height = natH + "px";
      ifr.style.transform = "scale(" + scale + ")";
      fr.style.height = Math.round(natH * scale) + "px";
    });
  }
  if (doc.querySelector(".sw-frame")) {
    scaleSnapWidget();
    window.addEventListener("resize", scaleSnapWidget, { passive: true });
    window.addEventListener("load", scaleSnapWidget);
  }

  /* ---------- Current year ---------- */
  var yr = doc.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
