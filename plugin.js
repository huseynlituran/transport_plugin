(function () {
  // --- Translations ---
  const translations = {
    az: {
      arrivalMsg: (time, venue) => `Siz saat ${time}-da <b>${venue}</b> məkanına çatırsınız. Oradan hara gedəcəksiniz?`,
      departureMsg: (time, venue) => `Sizin saat ${time}-da <b>${venue}</b> məkanından səfəriniz var. Oraya haradan gələcəksiniz?`,
      whereTo: "Gedəcəyiniz ünvanı yazın...",
      whereFrom: "Gələcəyiniz ünvanı yazın...",
      fromLabel: "Haradan:",
      toLabel: "Hara:",
      economy: "Ekonom",
      comfort: "Komfort",
      order: "Taksi Sifariş Et",
      findingDriver: "Sürücü axtarılır...",
      driverFound: "Sürücü tapıldı!",
      arrivingIn: "Çatacaq:",
      scheduledFor: "Təyin olundu:",
      min: "dəq",
      close: "✕",
      azn: "AZN"
    },
    ru: {
      arrivalMsg: (time, venue) => `Вы прибываете в <b>${venue}</b> в ${time}. Куда вы хотите поехать оттуда?`,
      departureMsg: (time, venue) => `Ваш рейс/поезд из <b>${venue}</b> в ${time}. Откуда вас забрать?`,
      whereTo: "Введите адрес назначения...",
      whereFrom: "Введите адрес отправления...",
      fromLabel: "Откуда:",
      toLabel: "Куда:",
      economy: "Эконом",
      comfort: "Комфорт",
      order: "Заказать такси",
      findingDriver: "Поиск водителя...",
      driverFound: "Водитель найден!",
      arrivingIn: "Прибудет через:",
      scheduledFor: "Назначено на:",
      min: "мин",
      close: "✕",
      azn: "AZN"
    },
    en: {
      arrivalMsg: (time, venue) => `You are arriving at <b>${venue}</b> at ${time}. Where are you heading next?`,
      departureMsg: (time, venue) => `Your departure from <b>${venue}</b> is at ${time}. Where do you need a ride from?`,
      whereTo: "Enter destination address...",
      whereFrom: "Enter pickup address...",
      fromLabel: "From:",
      toLabel: "To:",
      economy: "Economy",
      comfort: "Comfort",
      order: "Order Taxi",
      findingDriver: "Finding driver...",
      driverFound: "Driver found!",
      arrivingIn: "Arriving in:",
      scheduledFor: "Scheduled for:",
      min: "min",
      close: "✕",
      azn: "AZN"
    }
  };

  // --- Mock Data ---
  const mockDrivers = [
    { name: "Rauf Səmədov", plate: "77-RS-412", car: "Toyota Camry", eta: 4 },
    { name: "Elnur Hüseynov", plate: "10-EH-887", car: "Hyundai Sonata", eta: 6 },
    { name: "Orxan Quliyev", plate: "99-OQ-234", car: "Kia K5", eta: 3 }
  ];

  function getRandomPrice(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  // --- Language Detection ---
  const browserLang = navigator.language || navigator.userLanguage;
  let currentLang = 'en';
  if (browserLang.startsWith('az')) currentLang = 'az';
  else if (browserLang.startsWith('ru')) currentLang = 'ru';

  const t = translations[currentLang];

  // --- CSS Injection ---
  const style = document.createElement('style');
  style.textContent = `
    #st-plugin-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 360px;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      z-index: 999999;
      transform: translateY(150%);
      transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid #e2e8f0;
    }
    #st-plugin-container.visible {
      transform: translateY(0);
    }
    .st-header {
      background: #6a2a5b; /* Baku Taxi Purple */
      color: white;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #F4AC10;
    }
    .st-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .st-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.8);
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
    }
    .st-close:hover {
      color: white;
    }
    .st-body {
      padding: 20px;
    }
    .st-message {
      font-size: 14px;
      color: #334155;
      margin-bottom: 20px;
      line-height: 1.5;
      background: #f0f8ff;
      padding: 12px;
      border-radius: 12px;
      border-left: 4px solid #0056b3;
    }
    .st-input-container {
      position: relative;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8fafc;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    .st-input-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .st-input-label {
      width: 65px;
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
    }
    .st-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      box-sizing: border-box;
      transition: border-color 0.2s;
      outline: none;
      width: 100%;
    }
    .st-input:focus {
      border-color: #0056b3;
      box-shadow: 0 0 0 2px rgba(0,86,179,0.1);
    }
    .st-input-locked {
      background-color: #e2e8f0;
      color: #475569;
      font-weight: 500;
      cursor: not-allowed;
      border-color: #cbd5e1;
    }
    .st-tariffs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .st-tariff {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .st-tariff.selected {
      border-color: #0056b3;
      background: #f0f8ff;
      color: #004b87;
    }
    .st-tariff-name {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .st-tariff-price {
      font-size: 12px;
      color: #64748b;
    }
    .st-btn {
      width: 100%;
      background: #6a2a5b;
      color: white;
      border: none;
      padding: 14px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .st-btn:hover {
      background: #542048;
    }
    
    /* Loading state */
    .st-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
    }
    .st-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f1f5f9;
      border-top: 4px solid #F4AC10;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    /* Driver Card */
    .st-driver-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
    }
    .st-driver-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      align-items: center;
    }
    .st-driver-name {
      font-weight: 600;
      color: #0f172a;
      font-size: 15px;
    }
    .st-driver-rating {
      color: #fbbf24;
      font-size: 13px;
      font-weight: 600;
    }
    .st-car-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .st-car-model {
      font-size: 14px;
      color: #475569;
    }
    .st-car-plate {
      background: #cbd5e1;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 13px;
      font-weight: bold;
      color: #1e293b;
    }
    .st-eta-box {
      background: #6a2a5b;
      color: white;
      text-align: center;
      padding: 10px;
      border-radius: 8px;
      font-size: 14px;
    }
    .st-eta-time {
      font-size: 20px;
      font-weight: bold;
      margin: 4px 0;
    }
  `;
  document.head.appendChild(style);

  // --- Plugin DOM Setup ---
  const container = document.createElement('div');
  container.id = 'st-plugin-container';
  document.body.appendChild(container);

  let currentCountdownInterval;

  // --- Core Logic ---
  function renderStep1(data) {
    // Statik qiymətlər - demo zamanı rəqəmlərin dəyişməməsi daha peşəkar görünür
    const ecoPrice = "5.50";
    const comfPrice = "8.20";

    let msg = "";
    let inputsHTML = "";

    if (data.ticketType === 'arrival') {
      // User is arriving TO a venue. So FROM is locked as Venue, TO is active.
      msg = t.arrivalMsg(data.eventTime, data.venueName);
      inputsHTML = `
        <div class="st-input-container">
          <div class="st-input-group">
            <div class="st-input-label">${t.fromLabel}</div>
            <input type="text" class="st-input st-input-locked" value="${data.venueName}" readonly>
          </div>
          <div class="st-input-group">
            <div class="st-input-label">${t.toLabel}</div>
            <input type="text" class="st-input" placeholder="${t.whereTo}" id="st-user-input">
          </div>
        </div>
      `;
    } else {
      // User is departing FROM a venue. So TO is locked as Venue, FROM is active.
      msg = t.departureMsg(data.eventTime, data.venueName);
      inputsHTML = `
        <div class="st-input-container">
          <div class="st-input-group">
            <div class="st-input-label">${t.fromLabel}</div>
            <input type="text" class="st-input" placeholder="${t.whereFrom}" id="st-user-input">
          </div>
          <div class="st-input-group">
            <div class="st-input-label">${t.toLabel}</div>
            <input type="text" class="st-input st-input-locked" value="${data.venueName}" readonly>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="st-header">
        <h3 style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 18px; font-weight: 700;">
          <svg width="28" height="26" viewBox="0 0 30 28" fill="#F4AC10">
            <path d="M 0 6 C 0 2 6 2 6 6 L 6 16 L 0 16 Z" />
            <path d="M 12 10 C 12 6 18 6 18 10 L 18 16 L 12 16 Z" />
            <path d="M 24 6 C 24 2 30 2 30 6 L 30 16 L 24 16 Z" />
            <rect x="6" y="16" width="6" height="6" />
            <rect x="18" y="16" width="6" height="6" />
            <rect x="0" y="22" width="6" height="6" />
            <rect x="12" y="22" width="6" height="6" />
            <rect x="24" y="22" width="6" height="6" />
          </svg>
          <span style="letter-spacing: 0;">Baku Taxi</span>
        </h3>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: #F4AC10; color: #6a2a5b; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            1000
          </span>
          <button class="st-close" id="st-close-btn">${t.close}</button>
        </div>
      </div>
      <div class="st-body">
        <div class="st-message">${msg}</div>
        
        ${inputsHTML}
        
        <div class="st-tariffs">
          <div class="st-tariff selected" data-type="eco">
            <div class="st-tariff-name">${t.economy}</div>
            <div class="st-tariff-price">${ecoPrice} ${t.azn}</div>
          </div>
          <div class="st-tariff" data-type="comf">
            <div class="st-tariff-name">${t.comfort}</div>
            <div class="st-tariff-price">${comfPrice} ${t.azn}</div>
          </div>
        </div>
        <button class="st-btn" id="st-order-btn">${t.order}</button>
      </div>
    `;

    // Events
    document.getElementById('st-close-btn').addEventListener('click', hidePlugin);

    const tariffs = container.querySelectorAll('.st-tariff');
    tariffs.forEach(tar => {
      tar.addEventListener('click', function () {
        tariffs.forEach(t => t.classList.remove('selected'));
        this.classList.add('selected');
      });
    });

    const activeInput = document.getElementById('st-user-input');
    const orderBtn = document.getElementById('st-order-btn');

    orderBtn.addEventListener('click', () => {
      if (!activeInput.value.trim()) {
        activeInput.style.borderColor = '#ef4444';
        setTimeout(() => activeInput.style.borderColor = '', 1000);
        return;
      }
      renderStep2(data);
    });
  }

  function renderStep2(data) {
    container.innerHTML = `
      <div class="st-header">
        <h3 style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 18px; font-weight: 700;">
          <svg width="28" height="26" viewBox="0 0 30 28" fill="#F4AC10">
            <path d="M 0 6 C 0 2 6 2 6 6 L 6 16 L 0 16 Z" />
            <path d="M 12 10 C 12 6 18 6 18 10 L 18 16 L 12 16 Z" />
            <path d="M 24 6 C 24 2 30 2 30 6 L 30 16 L 24 16 Z" />
            <rect x="6" y="16" width="6" height="6" />
            <rect x="18" y="16" width="6" height="6" />
            <rect x="0" y="22" width="6" height="6" />
            <rect x="12" y="22" width="6" height="6" />
            <rect x="24" y="22" width="6" height="6" />
          </svg>
          <span style="letter-spacing: 0;">Baku Taxi</span>
        </h3>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: #F4AC10; color: #6a2a5b; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            1000
          </span>
          <button class="st-close" id="st-close-btn">${t.close}</button>
        </div>
      </div>
      <div class="st-body st-loading">
        <div class="st-spinner"></div>
        <div style="color: #475569; font-weight: 500;">${t.findingDriver}</div>
      </div>
    `;
    document.getElementById('st-close-btn').addEventListener('click', hidePlugin);

    setTimeout(() => {
      renderStep3(data);
    }, 1500);
  }

  function renderStep3(data) {
    const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];

    let taxiTime = "";
    if (data && data.eventTime) {
      const [hours, minutes] = data.eventTime.split(':').map(Number);
      let date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);

      if (data.ticketType === 'arrival') {
        date.setMinutes(date.getMinutes() + 5); // 5 minutes after arrival
      } else {
        date.setMinutes(date.getMinutes() - 60); // 1 hour before departure
      }

      taxiTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    container.innerHTML = `
      <div class="st-header">
        <h3 style="display: flex; align-items: center; gap: 8px; margin: 0; font-size: 18px; font-weight: 700;">
          <svg width="28" height="26" viewBox="0 0 30 28" fill="#F4AC10">
            <path d="M 0 6 C 0 2 6 2 6 6 L 6 16 L 0 16 Z" />
            <path d="M 12 10 C 12 6 18 6 18 10 L 18 16 L 12 16 Z" />
            <path d="M 24 6 C 24 2 30 2 30 6 L 30 16 L 24 16 Z" />
            <rect x="6" y="16" width="6" height="6" />
            <rect x="18" y="16" width="6" height="6" />
            <rect x="0" y="22" width="6" height="6" />
            <rect x="12" y="22" width="6" height="6" />
            <rect x="24" y="22" width="6" height="6" />
          </svg>
          <span style="letter-spacing: 0;">Baku Taxi</span>
        </h3>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: #F4AC10; color: #6a2a5b; padding: 4px 10px; border-radius: 20px; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            1000
          </span>
          <button class="st-close" id="st-close-btn">${t.close}</button>
        </div>
      </div>
      <div class="st-body">
        <h4 style="margin-top:0; color: #0f172a; text-align: center;">${t.driverFound}</h4>
        <div class="st-driver-card">
          <div class="st-driver-header">
            <span class="st-driver-name">${driver.name}</span>
            <span class="st-driver-rating">★ 4.9</span>
          </div>
          <div class="st-car-info">
            <span class="st-car-model">${driver.car}</span>
            <span class="st-car-plate">${driver.plate}</span>
          </div>
          <div class="st-eta-box">
            <div>${t.scheduledFor}</div>
            <div class="st-eta-time">${taxiTime}</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('st-close-btn').addEventListener('click', hidePlugin);
  }

  function showPlugin(data) {
    renderStep1(data);
    setTimeout(() => {
      container.classList.add('visible');
    }, 10);
  }

  function hidePlugin() {
    container.classList.remove('visible');
    if (currentCountdownInterval) {
      clearInterval(currentCountdownInterval);
    }
  }

  // --- Event Listener ---
  window.addEventListener('ticketPurchased', (e) => {
    console.log("Ticket purchased event received:", e.detail);
    showPlugin(e.detail);
  });

})();
