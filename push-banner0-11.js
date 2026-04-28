// push-banner-card-preload.js
(async function() {
  const url = "https://s.adtelligent.com/?subscription_date=20260428&subscription_timestamp=1777404370&lang=en&subscriber_id=12345&uip=127.0.0.1&ua=testUA&subid=testSub&domain=example.com&aid=974055";
  const response = await fetch(url);
  const data = await response.json();
  const iconUrl = data.imp_url && data.imp_url.trim() !== "" ? data.imp_url : data.image_url;

  // Preload images
  function preload(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  }

  try {
    await Promise.all([preload(iconUrl), preload(data.image_url)]);

    const style = document.createElement("style");
    style.textContent = `
      #push-banner {
        position:fixed;
        bottom:20px;
        right:20px;
        width:320px;
        background:#fff;
        border-radius:12px;
        box-shadow:0 6px 14px rgba(0,0,0,0.25);
        font-family:Arial,sans-serif;
        overflow:hidden;
        z-index:9999;
        opacity:0;
        transform:translateY(50px);
        animation: slideIn 0.6s forwards;
      }
      @keyframes slideIn {
        from { opacity:0; transform:translateY(50px); }
        to { opacity:1; transform:translateY(0); }
      }
      #push-banner.hide { animation: slideOut 0.6s forwards; }
      @keyframes slideOut {
        from { opacity:1; transform:translateY(0); }
        to { opacity:0; transform:translateY(50px); }
      }
      #push-banner .timer-bar {
        height:3px;
        background:linear-gradient(90deg, #0073e6, #00c6ff);
        animation: timerLine 8s linear forwards;
      }
      @keyframes timerLine { from { width:100%; } to { width:0%; } }
      #push-banner .top {
        display:flex;
        align-items:center;
        padding:10px;
      }
      #push-banner .icon {
        width:40px;
        height:40px;
        border-radius:6px;
        overflow:hidden;
        margin-right:10px;
        flex-shrink:0;
      }
      #push-banner .icon img {
        width:100%; height:100%; object-fit:cover;
      }
      #push-banner .text h3 {
        margin:0; font-size:16px; color:#222;
      }
      #push-banner .text p {
        margin:4px 0 0; font-size:13px; color:#555;
      }
      #push-banner .hero img {
        width:100%; height:auto; display:block;
      }
      #push-banner .cta {
        display:block;
        margin:10px auto;
        text-align:center;
        width:90%;
        background:#0073e6;
        color:#fff;
        padding:8px;
        border-radius:6px;
        font-weight:bold;
        text-decoration:none;
        transition:background 0.3s ease;
      }
      #push-banner .cta:hover { background:#005bb5; }
    `;
    document.head.appendChild(style);

    const banner = document.createElement("div");
    banner.id = "push-banner";
    banner.innerHTML = `
      <div class="timer-bar"></div>
      <div class="top">
        <div class="icon"><img src="${iconUrl}" alt="icon"></div>
        <div class="text">
          <h3>${data.title}</h3>
          <p>${data.description}</p>
        </div>
      </div>
      <div class="hero"><img src="${data.image_url}" alt="main image"></div>
      <a href="${data.link}" target="_blank" class="cta">Learn more</a>
    `;
    document.body.appendChild(banner);

    // Auto-hide
    setTimeout(() => {
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 600);
    }, 8000);

  } catch (err) {
    console.error("Error preloading images:", err);
  }
})();
