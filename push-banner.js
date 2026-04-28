// push-banner.js
(async function() {
  const url = "http://s.adtelligent.com/?subscription_date=20260428&subscription_timestamp=1777404370&lang=uk&subscriber_id=12345&uip=127.0.0.1&ua=testUA&subid=testSub&domain=example.com&aid=974055";

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Створюємо контейнер
    const banner = document.createElement("div");
    banner.id = "push-banner";
    banner.style.cssText = `
      border:1px solid #ccc;
      width:300px;
      padding:10px;
      font-family:Arial,sans-serif;
      position:fixed;
      bottom:-400px; /* старт поза екраном */
      right:20px;
      background:#fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      z-index:9999;
      transition: bottom 0.6s ease; /* плавний виїзд */
    `;

    banner.innerHTML = `
      <img src="${data.image_url}" alt="push image" style="max-width:100%;height:auto;display:block;margin-bottom:8px;">
      <a href="${data.link}" target="_blank" style="text-decoration:none;color:#0073e6;font-weight:bold;">${data.title}</a>
      <p style="margin:5px 0;font-size:14px;">${data.description}</p>
      <button id="close-push" style="margin-top:8px;padding:4px 8px;">Закрити</button>
    `;

    document.body.appendChild(banner);

    // Трекінг показу
    if (data.imp_url) new Image().src = data.imp_url;
    if (data.nurl) new Image().src = data.nurl;

    // Запускаємо анімацію виїзду
    setTimeout(() => {
      banner.style.bottom = "20px";
    }, 100); // невелика затримка для плавності

    // Закриття банера
    document.getElementById("close-push").onclick = () => banner.remove();

    // Автозникнення через 15 секунд
    setTimeout(() => banner.remove(), 15000);

  } catch (err) {
    console.error("Помилка при отриманні відповіді:", err);
  }
})();
