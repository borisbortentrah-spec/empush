// demo-push-banners.js
(async function() {
  const url = "https://s.adtelligent.com/?subscription_date=20260428&subscription_timestamp=1777404370&lang=en&subscriber_id=12345&uip=127.0.0.1&ua=testUA&subid=testSub&domain=example.com&aid=974055";
  const response = await fetch(url);
  const data = await response.json();
  const iconUrl = data.imp_url && data.imp_url.trim() !== "" ? data.imp_url : data.image_url;

  function showBanner(version, position, delay = 0, onHide = null) {
    setTimeout(() => {
      const banner = document.createElement("div");
      banner.className = `push-banner version-${version}`;
      banner.innerHTML = getBannerLayout(version, data, iconUrl);
      document.body.appendChild(banner);

      switch(position) {
        case "bottom-right": banner.style.bottom="20px"; banner.style.right="20px"; break;
        case "top-right": banner.style.top="20px"; banner.style.right="20px"; break;
        case "top-left": banner.style.top="20px"; banner.style.left="20px"; break;
        case "bottom-center": banner.style.bottom="20px"; banner.style.left="50%"; banner.style.transform="translateX(-50%)"; break;
        case "top-center": banner.style.top="20px"; banner.style.left="50%"; banner.style.transform="translateX(-50%)"; break;
      }

      setTimeout(() => {
        banner.classList.add("hide");
        setTimeout(() => {
          banner.remove();
          if (onHide) onHide();
        }, 800);
      }, 5000);
    }, delay);
  }

  function getBannerLayout(version, data, iconUrl) {
    const gradients = {
      8: "linear-gradient(90deg, red, yellow)",
      7: "linear-gradient(90deg, green, turquoise)",
      6: "linear-gradient(90deg, orange, pink)",
      5: "linear-gradient(90deg, blue, purple)",
      4: "linear-gradient(90deg, purple, red)"
    };
    const timerBar = `<div class="timer-bar" style="background:${gradients[version]}"></div>`;
    switch(version) {
      case 8:
        return `${timerBar}
          <div class="header"><div class="icon"><img src="${iconUrl}"></div>
          <div><h3>${data.title}</h3><p>${data.description}</p></div></div>
          <div class="hero"><img src="${data.image_url}"></div>`;
      case 7:
        return `${timerBar}
          <div class="hero"><img src="${data.image_url}"></div>
          <h3>${data.title}</h3><p>${data.description}</p>
          <div class="bottom"><div class="icon"><img src="${iconUrl}"></div>
          <a href="${data.link}" target="_blank" class="cta">Learn more</a></div>`;
      case 6:
        return `${timerBar}
          <img src="${data.image_url}" class="main">
          <h3>${data.title}</h3><p>${data.description}</p>
          <div class="bottom"><div class="icon"><img src="${iconUrl}"></div>
          <span>Sponsored content</span></div>`;
      case 5:
        return `${timerBar}
          <img src="${data.image_url}" class="main">
          <h3>${data.title}</h3><p>${data.description}</p>`;
      case 4:
        return `${timerBar}
          <div class="close-arrow">×</div>
          <img src="${data.image_url}" class="main">
          <h3>${data.title}</h3><p>${data.description}</p>`;
      default:
        return `${timerBar}<h3>${data.title}</h3><p>${data.description}</p>`;
    }
  }

  const style = document.createElement("style");
  style.textContent = `
    .push-banner {
      position:fixed;
      background:#fff;
      border:1px solid #000;
      border-radius:8px;
      box-shadow:0 4px 10px rgba(0,0,0,0.2);
      padding:10px;
      font-family:Arial,sans-serif;
      opacity:0;
      transform:scaleY(0) translateX(350px);
      animation: foldIn 0.8s forwards;
      z-index:9999;
      width:280px;
    }
    .push-banner.hide { animation: foldOut 0.8s forwards; }
    @keyframes foldIn {
      0% { transform:scaleY(0) translateX(350px); opacity:0; }
      50% { transform:scaleY(0.5) translateX(0); opacity:0.7; }
      100% { transform:scaleY(1) translateX(0); opacity:1; }
    }
    @keyframes foldOut {
      0% { transform:scaleY(1) translateX(0); opacity:1; }
      50% { transform:scaleY(0.5) translateX(0); opacity:0.7; }
      100% { transform:scaleY(0) translateX(350px); opacity:0; }
    }
    .hero img, .main { width:100%; height:auto; display:block; margin-bottom:6px; }
    .icon img { width:32px; height:32px; border-radius:4px; }
    .cta { background:#0073e6; color:#fff; padding:4px 8px; border-radius:4px; text-decoration:none; }
    .timer-bar { height:3px; animation: timerLine 5s linear forwards; }
    @keyframes timerLine { from { width:100%; } to { width:0%; } }
  `;
  document.head.appendChild(style);

  // запуск послідовності
  showBanner(8, "bottom-right", 0, () => showBanner(5, "bottom-center"));
  showBanner(7, "top-right", 2000, () => showBanner(4, "top-center"));
  showBanner(6, "top-left", 4000);
})();
