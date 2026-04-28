// push-banner.js
(async function() {
  const url = "https://s.adtelligent.com/?subscription_date=20260428&subscription_timestamp=1777404370&lang=en&subscriber_id=12345&uip=127.0.0.1&ua=testUA&subid=testSub&domain=example.com&aid=974055";

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Choose icon
    const iconUrl = data.imp_url && data.imp_url.trim() !== "" ? data.imp_url : data.image_url;

    // Styles
    const style = document.createElement("style");
    style.textContent = `
      #push-banner {
        border:1px solid #000;
        border-radius:8px;
        width:280px;
        padding:8px;
        font-family:Arial,sans-serif;
        position:fixed;
        bottom:20px;
        right:20px;
        background:#fff;
        box-shadow:0 4px 10px rgba(0,0,0,0.2);
        z-index:9999;
        opacity:0;
        transform:scaleY(0) translateX(350px);
        animation: foldIn 0.8s forwards;
      }
      #push-banner .close-arrow {
        position:absolute;
        top:6px;
        right:6px;
        cursor:pointer;
        font-size:14px;
        font-weight:bold;
        color:#fff;
        background:#333;
        border-radius:50%;
        width:22px;
        height:22px;
        display:flex;
        align-items:center;
        justify-content:center;
        line-height:1;
        transition: transform 0.4s ease;
      }
      #push-banner .close-arrow:hover {
        transform: rotate(180deg);
      }
      #push-banner .timer-bar {
        position:absolute;
        top:0;
        left:0;
        height:3px;
        background:#0073e6;
        animation: timerLine 15s linear forwards;
      }
      @keyframes timerLine {
        from { width:100%; }
        to { width:0%; }
      }
      #push-banner .content {
        margin-top:8px;
      }
      #push-banner .bottom {
        display:flex;
        align-items:center;
        margin-top:6px;
      }
      #push-banner .icon {
        width:32px;
        height:32px;
        border-radius:4px;
        overflow:hidden;
        flex-shrink:0;
        margin-right:8px;
      }
      #push-banner .icon img {
        width:100%;
        height:100%;
        object-fit:cover;
      }
      #push-banner.hide {
        animation: foldOut 0.8s forwards;
      }
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
      #push-banner:hover {
        box-shadow:0 6px 14px rgba(0,0,0,0.3);
        transform:scale(1.02);
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);

    // Container
    const banner = document.createElement("div");
    banner.id = "push-banner";
    banner.innerHTML = `
      <div class="timer-bar"></div>
      <div class="close-arrow">×</div>
      <div class="content">
        <img src="${data.image_url}" alt="push image" style="max-width:100%;height:auto;display:block;margin-bottom:6px;">
        <a href="${data.link}" target="_blank" style="text-decoration:none;color:#0073e6;font-weight:bold;">${data.title}</a>
        <p style="margin:4px 0;font-size:13px;">${data.description}</p>
        <div class="bottom">
          <div class="icon"><img src="${iconUrl}" alt="icon"></div>
          <span style="font-size:12px;color:#555;">Sponsored content</span>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Tracking
    if (data.imp_url) new Image().src = data.imp_url;
    if (data.nurl) new Image().src = data.nurl;

    // Close
    banner.querySelector(".close-arrow").onclick = () => {
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 800);
    };

    // Auto-hide
    setTimeout(() => {
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 800);
    }, 15000);

  } catch (err) {
    console.error("Error fetching banner data:", err);
  }
})();
