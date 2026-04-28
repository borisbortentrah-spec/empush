// push-banner.js
(async function() {
  const url = "https://s.adtelligent.com/?subscription_date=20260428&subscription_timestamp=1777404370&lang=uk&subscriber_id=12345&uip=127.0.0.1&ua=testUA&subid=testSub&domain=example.com&aid=974055";

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Стилі для анімацій
    const style = document.createElement("style");
    style.textContent = `
      #push-banner {
        border:1px solid #000; /* тонкий чорний контур */
        border-radius:8px;     /* трохи скруглені кути */
        width:300px;
        padding:10px;
        font-family:Arial,sans-serif;
        position:fixed;
        bottom:20px;
        right:20px;
        background:#fff;
        box-shadow:0 4px 10px rgba(0,0,0,0.2); /* легка тінь */
        z-index:9999;
        opacity:0;
        transform:scaleY(0) translateX(350px);
        animation: foldIn 0.8s forwards;
      }
      #push-banner img {
        max-width:100%;
        height:auto;
        display:block;
        margin-bottom:8px;
      }
      #push-banner .close-arrow {
        position:absolute;
        top:5px;
        right:8px;
        cursor:pointer;
        font-size:18px;
        font-weight:bold;
        color:#333;
        transform:rotate(45deg); /* виглядає як стрілочка */
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

    // Створюємо контейнер
    const banner = document.createElement("div");
    banner.id = "push-banner";
    banner.innerHTML = `
      <div class="close-arrow">➤</div>
      <img src="${data.image_url}" alt="push image">
      <a href="${data.link}" target="_blank" style="text-decoration:none;color:#0073e6;font-weight:bold;">${data.title}</a>
      <p style="margin:5px 0;font-size:14px;">${data.description}</p>
    `;
    document.body.appendChild(banner);

    // Трекінг показу
    if (data.imp_url) new Image().src = data.imp_url;
    if (data.nurl) new Image().src = data.nurl;

    // Закриття банера по кліку на стрілочку
    banner.querySelector(".close-arrow").onclick = () => {
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 800);
    };

    // Автозникнення через 15 секунд
    setTimeout(() => {
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 800);
    }, 15000);

  } catch (err) {
    console.error("Помилка при отриманні відповіді:", err);
  }
})();
