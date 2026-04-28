// push-banner.js
(async function() {
  const url = "https://s.adtelligent.com/?subscription_date=20260428&subscription_timestamp=1777404370&lang=en&subscriber_id=12345&uip=127.0.0.1&ua=testUA&subid=testSub&domain=example.com&aid=974055";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const iconUrl = data.imp_url && data.imp_url.trim() !== "" ? data.imp_url : data.image_url;

    const style = document.createElement("style");
    style.textContent = `
      #push-banner {
        border:1px solid #000;
        border-radius:12px;
        width:320px;
        font-family:Arial,sans-serif;
        position:fixed;
        bottom:20px;
        right:20px;
        background:#fff;
        box-shadow:0 6px 14px rgba(0,0,0,0.25);
        z-index:9999;
        opacity:0;
        transform:scaleY(0) translateX(350px);
        animation: foldIn 0.8s forwards;
        overflow:hidden;
      }
      #push-banner .close-arrow {
        position:absolute;
        top:8px;
        right:8px;
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
      #push-banner .hero {
        width:100%;
        height:160px;
        overflow:hidden;
      }
      #push-banner .hero img {
        width:100%;
        height:100%;
        object-fit:cover;
      }
      #push-banner .content {
        padding:12px;
      }
      #push-banner .content h3 {
        margin:6px 0;
        font-size:18px;
        color:#222;
      }
      #push-banner .content p {
        margin:4px 0;
        font-size:14px;
        color:#555;
      }
      #push-banner .bottom {
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin-top:10px;
      }
      #push-banner .icon {
        width:36px;
        height:36px;
        border-radius:6px;
        overflow:hidden;
        flex-shrink:0;
      }
      #push-banner .icon img {
        width:100%;
        height:100%;
        object-fit:cover;
      }
      #push-banner .cta {
        text-decoration:none;
        color:#fff;
        background:#0073e6;
        padding:6px 14px;
        border-radius:6px;
        font-size:13px;
        font-weight:bold;
        transition: background 0.3s ease;
      }
      #push-banner .cta:hover {
        background:#005bb5;
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
    `;
    document.head.appendChild(style);

    const banner = document.createElement("div");
    banner.id = "push-banner";
    banner.innerHTML = `
      <div class="timer-bar"></div>
      <div class="close-arrow">×</div>
      <div class="hero">
        <img src="${data.image_url}" alt="main image">
      </div>
      <div class="content">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <div class="bottom">
          <div class="icon"><img src="${iconUrl}" alt="icon"></div>
          <a href="${data.link}" target="_blank" class="cta">Learn more</a>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    if (data.imp_url) new Image().src = data.imp_url;
    if (data.nurl) new Image().src = data.nurl;

    banner.querySelector(".close-arrow").onclick = () => {
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 800);
    };

    setTimeout(() => {
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 800);
    }, 15000);

  } catch (err) {
    console.error("Error fetching banner data:", err);
  }
})();
