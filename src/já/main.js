(function () {
  var isPageHidden = false;
  var isLowEndDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4) || window.innerWidth < 480;
  var isMobile = window.innerWidth < 768;
  var performanceScale = (isLowEndDevice || isMobile) ? 0.4 : 1;
  document.addEventListener("visibilitychange", function () { isPageHidden = document.hidden; });

  var resizeTimer;
  var resizeCallbacks = [];
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      for (var i = 0; i < resizeCallbacks.length; i++) resizeCallbacks[i]();
    }, 120);
  });
  function onResize(fn) { resizeCallbacks.push(fn); }

  var canvasScale = (isLowEndDevice ? 0.35 : isMobile ? 0.5 : 0.55);
  var pixelScale = 0.35;

  var animationQueue = [];
  function _registerAnimation(fn, weight) {
    animationQueue.push({ fn: fn, weight: weight || 1, skipCounter: 0 });
  }
  function _unregisterAnimation(fn) {
    for (var i = animationQueue.length - 1; i >= 0; i--) {
      if (animationQueue[i].fn === fn) animationQueue.splice(i, 1);
    }
  }
  function runAnimationLoop() {
    requestAnimationFrame(runAnimationLoop);
    if (isPageHidden) return;
    for (var i = 0; i < animationQueue.length; i++) {
      var entry = animationQueue[i];
      if (entry.weight > 1) {
        entry.skipCounter++;
        if (entry.skipCounter < entry.weight) continue;
        entry.skipCounter = 0;
      }
      entry.fn();
    }
  }
  runAnimationLoop();

  var theme = CONFIG.theme;

  // Theme presets
  if (theme.preset) {
    var presets = {
      dark: {
        textColor: "#ffffff", backgroundColor: "#050505", glowColor: "#ffffff",
        containerColor: "rgba(255,255,255,0.04)", containerBlur: "8px", containerBorderColor: "rgba(255,255,255,0.15)",
        buttonBg: "rgba(255,255,255,0.1)", buttonBorder: "1px solid rgba(255,255,255,0.12)",
        selectionBg: "#ffffff", selectionColor: "#000000",
      },
      light: {
        textColor: "#1a1a1a", backgroundColor: "#ffffff", glowColor: "#1a1a1a",
        usernameEffects: "none", containerColor: "rgba(0,0,0,0.03)", containerBlur: "0px",
        containerBorderColor: "rgba(0,0,0,0.12)", buttonBg: "rgba(0,0,0,0.06)",
        buttonBorder: "1px solid rgba(0,0,0,0.1)", selectionBg: "#1a1a1a", selectionColor: "#ffffff",
        volumeBg: "rgba(0,0,0,0.08)", volumeBorder: "1px solid rgba(0,0,0,0.05)",
      },
      neon: {
        textColor: "#ffffff", backgroundColor: "#0a0015", glowColor: "#ff00ff",
        usernameEffects: "none", containerColor: "rgba(255,0,255,0.05)", containerBlur: "6px",
        containerBorderColor: "#ff00ff", containerBorderWidth: "1px",
        buttonBg: "rgba(255,0,255,0.15)", buttonBorder: "1px solid #ff00ff",
        selectionBg: "#ff00ff", selectionColor: "#000000",
      },
      ocean: {
        textColor: "#e0f7ff", backgroundColor: "#001220", glowColor: "#00e5ff",
        usernameEffects: "none", containerColor: "rgba(0,180,255,0.06)", containerBlur: "8px",
        containerBorderColor: "rgba(0,229,255,0.3)", buttonBg: "rgba(0,180,255,0.12)",
        buttonBorder: "1px solid rgba(0,229,255,0.2)", selectionBg: "#00e5ff", selectionColor: "#000a14",
        volumeBg: "rgba(0,180,255,0.12)", volumeBorder: "1px solid rgba(0,229,255,0.15)",
      },
    };
    var preset = presets[theme.preset];
    if (preset) { for (var key in preset) { theme[key] = preset[key]; } }
  }
  var css = document.createElement("style");
  css.textContent =
    ":root{" +
    "--textColor:" + theme.textColor + ";" +
    "--backgroundColor:" + theme.backgroundColor + ";" +
    "--colorUsernameGlow:0px 0px 16.5px " + theme.glowColor + ";" +
    "--usernameEffects:" + theme.usernameEffects + ";" +
    "--containerColor:" + theme.containerColor + ";" +
    "--containerBlur:" + theme.containerBlur + ";" +
    "--containerRadius:" + CONFIG.layout.containerRadius + ";" +
    "--containerWidth:" + CONFIG.layout.containerWidth + ";" +
    "--containerPadding:" + CONFIG.layout.containerPadding + ";" +
    "--profileBorderWidth:" + theme.containerBorderWidth + ";" +
    "--profileBorderColor:" + theme.containerBorderColor + ";" +
    "--presenceUsernameColor:" + theme.textColor + ";" +
    "--presenceStatusColor:" + theme.textColor + "b3;" +
    "--badgeContainerBackground:rgba(255,255,255,0.08);" +
    "--badgeContainerBorder:2px solid rgba(255,255,255,0.04);" +
    "--userBadge:18px;" +
    "--textColorDarker:rgba(255,255,255,0.5);" +
    "--iconColor:" + theme.textColor + ";" +
    "--joinStatus:rgba(255,255,255,0.65);" +
    "--audioPlayerBar:rgba(255,255,255,0.35);" +
    "--avatarBorder:2px solid rgba(255,255,255,0.4);" +
    "--containerBackgroundClip:border-box;" +
    "--containerBackgroundOrigin:border-box;" +
    "--volumeBackgroundcolor:" + theme.volumeBg + ";" +
    "--volumeBorder:" + theme.volumeBorder + ";" +
    "--buttonBackground:" + theme.buttonBg + ";" +
    "--buttonBorder:" + theme.buttonBorder + ";" +
    "--buttonRadius:" + theme.buttonRadius + ";" +
    "--buttonAlign:center;" +
    "--buttonBackgroundHover:" + theme.buttonBgHover + ";" +
    "--buttonBorderHover:" + theme.buttonBorder + ";" +
    "--buttonUrlColor:rgba(255,255,255,0.65);" +
    "--profileViewsContainerBorder:2px solid rgba(255,255,255,0.3);" +
    "--platformTextColor:rgba(255,255,255,0.4);" +
    "--audioIconBackground:rgba(255,255,255,0.2);" +
    "--progessBarFull:rgba(255,255,255,0.3);" +
    "--progessBarPlaying:" + theme.textColor + ";" +
    "--controlButtonsOther:rgba(255,255,255,0.5);" +
    "--controlButtonPlaying:" + theme.textColor + ";" +
    "--controlTextColor:rgba(255,255,255,0.7);" +
    "--modernLayoutBottomLeftDivider:rgba(255,255,255,0.14);" +
    "--sleekLayoutTopRightDivider:rgba(255,255,255,0.14);" +
    "}";

  if (CONFIG.theme.selectionBg) {
    css.textContent +=
      "::selection{background:" +
      CONFIG.theme.selectionBg +
      ";color:" +
      CONFIG.theme.selectionColor +
      "}";
  }

  if (CONFIG.cursor.enabled) {
    css.textContent +=
      '*{cursor:url("' +
      CONFIG.cursor.src +
      '") ' +
      CONFIG.cursor.hotspotX +
      " " +
      CONFIG.cursor.hotspotY +
      ",auto!important}";
  }
  css.textContent +=
    '.card{pointer-events:auto!important}' +
    '.badge{padding:2px!important}' +
    '.badge-icon,.splash-text{border-radius:6px!important}';
  css.textContent += ':root{--userBadge:14px!important}';

  // Global header-row rule (may be overridden per-layout below)
  css.textContent += '.header-row{flex-wrap:nowrap!important;overflow-x:visible!important}';

  // Layout presets
  switch (CONFIG.layout.type) {
    case "stacked":
      css.textContent +=
        '.profile-row{flex-direction:column!important;text-align:center!important;gap:6px!important}' +
        '.avatar{margin-right:0!important}' +
        '.text-col{align-items:center!important}' +
        '.header-row{flex-wrap:wrap!important;justify-content:center!important;overflow-x:visible!important}' +
        '.header-row>.tip-trigger{flex:0 0 100%!important;text-align:center!important}';
      break;
    case "compact":
      css.textContent +=
        '.profile-row{gap:8px!important}' +
        '.card{--containerPadding:14px!important;--containerRadius:12px!important;--containerWidth:36rem!important}' +
        '.avatar{height:80px!important;font-size:3.5em!important}' +
        '.text-col h1{font-size:28px!important;line-height:32px!important}' +
        '.links-row{gap:6px!important}' +
        '.link-btn{width:42px!important;height:42px!important}';
      break;
    case "minimal":
      css.textContent +=
        '.card{--containerColor:transparent!important;--profileBorderWidth:0px!important;--containerPadding:0px!important;--containerRadius:0px!important;--containerWidth:38rem!important}' +
        '.divider{display:none!important}' +
        '.links-section{margin-top:10px!important}' +
        '.views-box{border:none!important;padding:4px 10px!important;background:rgba(255,255,255,0.06)!important;border-radius:20px!important}';
      break;
    case "glass":
      css.textContent +=
        '.card{--containerColor:rgba(255,255,255,0.06)!important;--containerBlur:12px!important;--profileBorderColor:rgba(255,255,255,0.08)!important;--profileBorderWidth:1px!important}' +
        '.card{-webkit-backdrop-filter:blur(12px)!important;backdrop-filter:blur(12px)!important}';
      break;
    // default: no extra CSS needed
  }
  document.head.appendChild(css);

  // Font injection
  if (CONFIG.fonts.enabled && CONFIG.fonts.families) {
    var fontCss = document.createElement("style");
    fontCss.textContent =
      "body, * { font-family: '" +
      CONFIG.fonts.families.join("', '") +
      "', sans-serif !important; }" +
      ".Typewriter__wrapper { font-family: '" +
      CONFIG.fonts.families[0] +
      "', sans-serif !important; }";
    if (CONFIG.fonts.importUrl) {
      fontCss.textContent =
        '@import url("' +
        CONFIG.fonts.importUrl +
        '");' +
        fontCss.textContent;
    }
    document.head.appendChild(fontCss);
  }

  function renderAvatar() {
    var a = CONFIG.avatar;
    if (a.type === "image") {
      return       '<img class="avatar-img" src="' + a.src + '" alt="" width="120" height="120">';
    }
    return (
      '<span class="avatar">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="4 4 16 16">' +
      '<path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-6 8q-.825 0-1.413-.588T4 18v-.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.588 1.413T18 20H6Z"/>' +
      "</svg></span>"
    );
  }

  var BADGE_NAMES = {
    premium: "Premium", staff: "Staff Member", bug: "Bug Hunter", legend: "Legend",
    shield: "Shield", star: "Image Host", heart: "Heart", crown: "Crown",
    verified: "Verified", gift: "Gift", trophy: "Trophy", booster: "Booster",
  };

  function renderBadges() {
    if (!CONFIG.badges.length) return "";
    var badgeStyle = document.createElement("style");
    badgeStyle.id = "forgeBadgeStyles";
    var badgeHtml = CONFIG.badges.map(function (b) {
      if (typeof b === "string") {
        b = { icon: b, name: BADGE_NAMES[b] || b.charAt(0).toUpperCase() + b.slice(1), monochrome: true };
      }
      var iconSvg = BADGE_SVGS[b.icon] || BADGE_SVGS.premium;
      var c = b.monochrome ? "#ffffff" : b.color || BADGE_DEFAULT_COLORS[b.name] || "#a749dd";
      var shadow = b.monochrome ? "#ffffff" : c;
      var cls = "bg-" + b.name.replace(/[^a-zA-Z0-9]/g, "");
      badgeStyle.textContent += "." + cls + " svg{color:" + c + "!important;filter:drop-shadow(" + shadow + " 0 0 2.5px)!important}";
      return (
        '<div class="badge">' +
        '<span class="tip-trigger">' +
        '<div class="badge-icon">' +
        '<div class="' + cls + '" style="display:flex">' + iconSvg + "</div>" +
        "</div>" +
        '<span class="tip-content" style="--tooltip-max-width:260px;top:0px;left:0px;border-color:#1a1a1a33;background-color:#14141463" data-visible="false" data-placement="top">' +
        b.name +
        "</span>" +
        "</span>" +
        "</div>"
      );
    }).join("");
    document.head.appendChild(badgeStyle);
    return badgeHtml;
  }

  function renderLinks() {
    return CONFIG.links
      .map(function (l) {
        return (
          '<div class="link-btn link-btn-alt">' +
          '<a target="_blank" href="' +
          l.url +
          '">' +
          '<img class="link-icon" alt="" loading="lazy" src="' +
          l.icon +
          '" style="filter:drop-shadow(' +
          l.color +
          " 1px 0 7px);\">" +
          "</a></div>"
        );
      })
      .join("");
  }

  function renderAbout() {
    if (!CONFIG.about.enabled) return "";
    return (
      '<div class="divider"><div class="divider-inner"></div></div>' +
      '<div style="width:100%;max-width:var(--containerWidth);text-align:left;color:var(--textColor);font-size:15px;line-height:1.5;opacity:.85;padding:0 5px">' +
      CONFIG.about.text +
      "</div>"
    );
  }

  function renderLocation() {
    if (!CONFIG.location.enabled) return "";
    return (
      '<div style="display:flex;align-items:center;gap:8px;color:var(--textColor);font-size:13px;opacity:.7;margin-top:5px">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' +
      "<span>" +
      CONFIG.location.text +
      "</span>" +
      (CONFIG.location.timezone
        ? '<span style="margin-left:auto">' + getTimezoneTime(CONFIG.location.timezone) + "</span>"
        : "") +
      "</div>"
    );
  }

  function getTimezoneTime(tz) {
    try {
      return new Date().toLocaleTimeString("en-US", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch (e) {
      return "--:--:--";
    }
  }

  function renderPortfolio() {
    if (!CONFIG.portfolio.enabled) return "";
    var html =
      '<div class="divider false"><div class="divider-inner"></div></div>';
    if (CONFIG.portfolio.skills && CONFIG.portfolio.skills.length) {
      html +=
        '<div style="width:100%;max-width:var(--containerWidth);margin-bottom:10px">' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">';
      CONFIG.portfolio.skills.forEach(function (skill) {
        html +=
          '<span style="padding:5px 14px;border-radius:15px;background:var(--buttonBackground);border:var(--buttonBorder);color:var(--textColor);font-size:13px;font-weight:500">' +
          skill +
          "</span>";
      });
      html += "</div></div>";
    }
    if (CONFIG.portfolio.projects && CONFIG.portfolio.projects.length) {
      CONFIG.portfolio.projects.forEach(function (p) {
        html +=
          '<div style="width:100%;max-width:var(--containerWidth);padding:var(--containerPadding);border-radius:var(--containerRadius);background:var(--containerColor);-webkit-backdrop-filter:blur(var(--containerBlur));border:var(--profileBorderWidth) solid var(--profileBorderColor);box-sizing:border-box;margin-bottom:10px">' +
          '<div style="color:var(--textColor);font-weight:600;font-size:16px;margin-bottom:4px">' +
          p.name +
          "</div>" +
          '<div style="color:var(--textColor);font-size:14px;opacity:.75;margin-bottom:8px">' +
          p.description +
          "</div>" +
          (p.url
            ? '<a href="' +
              p.url +
              '" target="_blank" style="display:inline-block;padding:7px 18px;border-radius:20px;background:var(--buttonBackground);border:var(--buttonBorder);color:var(--textColor);text-decoration:none;font-size:13px;font-weight:500">Visit</a>'
            : "") +
          "</div>";
      });
    }
    return html;
  }

  function formatTime(t) {
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // Background effects
  function mountCanvasContainer(containerClass, initializer) {
    var container = document.createElement("div");
    container.className = containerClass;
    var canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block";
    container.appendChild(canvas);
    document.body.insertBefore(container, document.body.firstChild);
    initializer(canvas);
  }

  function initBackgroundEffects() {
    var effects = CONFIG.background.effects;
    if (!effects) return;
    if (effects.aurora) mountCanvasContainer("aurora-container", initAurora);
    if (effects.dither) mountCanvasContainer("dither-container", initDither);
    if (effects.plasma) mountCanvasContainer("plasma-container", initPlasma);
    if (effects.snow) mountCanvasContainer("dither-container", initSnow);
    if (effects.rain) mountCanvasContainer("dither-container", initRain);
    if (effects.stars) mountCanvasContainer("dither-container", initStars);
    if (effects.fireflies) mountCanvasContainer("dither-container", initFireflies);
  }

  function initAurora(canvas) {
    var ctx = canvas.getContext("2d");
    var _s = pixelScale;
    var w = (canvas.width = Math.round(canvas.offsetWidth * _s));
    var h = (canvas.height = Math.round(canvas.offsetHeight * _s));
    var time = 0;

    function resize() {
      w = canvas.width = Math.round(canvas.offsetWidth * _s);
      h = canvas.height = Math.round(canvas.offsetHeight * _s);
    }
    onResize(resize);

    function draw() {
      if(isPageHidden)return;
      time += 0.003;
      var imageData = ctx.createImageData(w, h);
      var data = imageData.data;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var i = (y * w + x) * 4;
          var nx = x / w - 0.5;
          var ny = y / h - 0.5;
          var d = Math.sqrt(nx * nx + ny * ny);
          var v1 = Math.sin(nx * 8 + time) * Math.cos(ny * 6 + time * 0.7) * 0.5 + 0.5;
          var v2 = Math.sin(nx * 5 + ny * 7 + time * 1.3) * 0.5 + 0.5;
          var v3 = Math.sin(nx * 3 - ny * 9 + time * 0.5 + Math.sin(d * 4 + time) * 0.3) * 0.5 + 0.5;
          data[i] = Math.floor(80 + v1 * 120 + v2 * 30);
          data[i + 1] = Math.floor(20 + v2 * 60 + v3 * 80);
          data[i + 2] = Math.floor(120 + v3 * 100 + v1 * 40);
          data[i + 3] = Math.floor(180 + v2 * 75);
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
    _registerAnimation(draw, 1);
  }

  function initDither(canvas) {
    var ctx = canvas.getContext("2d");
    var _s = canvasScale;
    var w = (canvas.width = Math.round(canvas.offsetWidth * _s));
    var h = (canvas.height = Math.round(canvas.offsetHeight * _s));

    function resize() {
      w = canvas.width = Math.round(canvas.offsetWidth * _s);
      h = canvas.height = Math.round(canvas.offsetHeight * _s);
    }
    onResize(resize);

    function draw() {
      if(isPageHidden){setTimeout(draw,200);return}
      var imageData = ctx.createImageData(w, h);
      var data = imageData.data;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var i = (y * w + x) * 4;
          var v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = Math.floor(15 + Math.random() * 25);
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setTimeout(draw, isPageHidden ? 500 : 50);
    }
    draw();
  }

  function initPlasma(canvas) {
    var ctx = canvas.getContext("2d");
    var _s = pixelScale;
    var w = (canvas.width = Math.round(canvas.offsetWidth * _s));
    var h = (canvas.height = Math.round(canvas.offsetHeight * _s));
    var time = 0;

    function resize() {
      w = canvas.width = Math.round(canvas.offsetWidth * _s);
      h = canvas.height = Math.round(canvas.offsetHeight * _s);
    }
    onResize(resize);

    function draw() {
      if(isPageHidden)return;
      time += 0.05;
      var imageData = ctx.createImageData(w, h);
      var data = imageData.data;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var i = (y * w + x) * 4;
          var v = Math.sin(x * 0.02 + time) + Math.sin(y * 0.03 + time * 0.7) + Math.sin((x + y) * 0.015 + time * 0.5) + Math.sin(Math.sqrt(x * x + y * y) * 0.02 + time);
          v = (v + 4) / 8;
          data[i] = Math.floor(100 + Math.sin(v * 6.28) * 100);
          data[i + 1] = Math.floor(50 + Math.sin(v * 6.28 + 2.09) * 80);
          data[i + 2] = Math.floor(150 + Math.sin(v * 6.28 + 4.19) * 100);
          data[i + 3] = 180;
        }
      }
     
