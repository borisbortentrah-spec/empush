// push-banner0-12.js
(async function() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang") || "en";
  const uip = params.get("uip") || "127.0.0.1";
  const ua = params.get("ua") || navigator.userAgent;
  const subid = params.get("subid") || "testSub";
  const domain = params.get("domain") || location.hostname;
  const aid = params.get("aid") || "974055";
  let position = params.get("position") || "rbc";
  const showCTA = params.get("show_cta") === "1";
  let tts = parseInt(params.get("tts") || "10", 10);
  if (tts < 7) tts = 7;
  if (tts > 30) tts = 30;
  let repeat = Math.min(parseInt(params.get("repeat") || "0", 10), 6);
  const rt = parseInt(params.get("rt") || "10", 10);
  const rotation = params.get("rotation") === "1";
  const softRefresh = Math.min(parseInt(params.get("soft-refresh") || "0", 10), 7);

  const baseUrl = `https://s.adtelligent.com/?lang=${lang}&uip=${uip}&ua=${encodeURIComponent(ua)}&subid=${subid}&domain=${domain}&aid=${aid}`;

  async function fetchData() {
    const response = await fetch(baseUrl + "&ts=" + Date.now());
    return await response.json();
  }

  function setPosition(banner, pos) {
    banner.style.top = banner.style.bottom = banner.style.left = banner.style.right = "";
    banner.style.transform = "";
    switch(pos) {
      case "rbc": banner.style.bottom="20px"; banner.style.right="20px"; break;
      case "lbc": banner.style.bottom="20px"; banner.style.left="20px"; break;
      case "ruc": banner.style.top="20px"; banner.style.right="20px"; break;
      case "luc": banner.style.top="20px"; banner.style.left="20px"; break;
      case "um": banner.style.top="20px"; banner.style.left="50%"; banner.style.transform="translateX(-50%)"; break;
      case "bm": banner.style.bottom="20px"; banner.style.left="50%"; banner.style.transform="translateX(-50%)"; break;
      case "rm": banner.style.top="50%"; banner.style.right="20px"; banner.style.transform="translateY(-50%)"; break;
      case "lm": banner.style.top="50%"; banner.style.left="20px"; banner.style.transform="translateY(-50%)"; break;
    }
  }

  function nextPosition(pos) {
    const order = ["rbc","lbc","ruc","luc","um","bm","rm","lm"];
    const idx = order.indexOf(pos);
    return order[(idx+1) % order.length];
  }

  async function showBanner(cycle=0) {
    const data = await fetchData();
    const iconUrl = data.imp_url && data.imp_url.trim() !== "" ? data.imp_url : data.image_url;

    const banner = document.createElement("div");
    banner.id = "push-banner";
    banner.innerHTML = `
      <div class="timer-bar"></div>
      <div class="top">
        <div class="icon"><img src="${iconUrl}" alt="icon"></div>
        <div class="text"><h3>${data.title}</h3><p>${data.description}</p></div>
      </div>
      <div class="hero"><img src="${data.image_url}" alt="main image"></div>
      ${showCTA ? `<a href="${data.link}" target="_blank" class="cta">Learn more</a>` : ""}
      <div class="close-arrow">×</div>
    `;
    document.body.appendChild(banner);
    setPosition(banner, position);

    // Клік по всій області банера (крім кнопки закриття)
    banner.addEventListener("click", (e) => {
      if (e.target.closest(".close-arrow")) return;
      if (data.link) window.open(data.link, "_blank");
    });

    // Закриття
    banner.querySelector(".close-arrow").addEventListener("click", (e) => {
      e.stopPropagation();
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 600);
    });

    // Автозникнення
    setTimeout(() => {
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 600);
    }, tts * 1000);

    // Soft-refresh
    if (softRefresh > 0) {
      let refreshCount = 0;
      const interval = setInterval(async () => {
        if (refreshCount >= softRefresh) return clearInterval(interval);
        const newData = await fetchData();
        banner.querySelector(".text h3").textContent = newData.title;
        banner.querySelector(".text p").textContent = newData.description;
        banner.querySelector(".hero img").src = newData.image_url;
        refreshCount++;
      }, (tts*1000)/(softRefresh+1));
    }

    // Repeat
    if (repeat > cycle) {
      setTimeout(() => {
        if (rotation) position = nextPosition(position);
        showBanner(cycle+1);
      }, (tts+rt)*1000);
    }
  }

// CSS
const style = document.createElement("style");
style.textContent = `
  #push-banner {
    position:fixed;
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
    cursor:pointer;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  #push-banner:hover {
    box-shadow:0 10px 20px rgba(0,0,0,0.35);
    transform:scale(1.03);
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
    animation: timerLine ${tts}s linear forwards;
  }
  @keyframes timerLine { from { width:100%; } to { width:0%; } }
  #push-banner .top { display:flex; align-items:center; padding:10px; }
  #push-banner .icon { width:40px; height:40px; border-radius:6px; overflow:hidden; margin-right:10px; flex-shrink:0; }
  #push-banner .icon img { width:100%; height:100%; object-fit:cover; }
  #push-banner .text h3 { margin:0; font-size:16px; color:#222; }
  #push-banner .text p { margin:4px 0 0; font-size:13px; color:#555; }
  #push-banner .hero img { width:100%; height:auto; display:block; }
  #push-banner .cta {
    display:block; margin:10px auto; text-align:center; width:90%;
    background:#0073e6; color:#fff; padding:8px; border-radius:6px;
    font-weight:bold; text-decoration:none; transition:background 0.3s ease;
  }
  #push-banner .cta:hover { background:#005bb5; }
  #push-banner .close-arrow {
    position:absolute; top:8px; right:8px;
    cursor:pointer; background:#333; color:#fff;
    border-radius:50%; width:22px; height:22px;
    display:flex; align-items:center; justify-content:center;
    font-size:14px; line-height:1;
  }
`;
document.head.appendChild(style);
