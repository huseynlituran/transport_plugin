(function() {
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
      background: linear-gradient(135deg, #004b87, #0056b3);
      color: white;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .st-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
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
      background: #0056b3;
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
      background: #004b87;
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
      border-top: 4px solid #0056b3;
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
      background: #004b87;
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
    const ecoPrice = getRandomPrice(4, 6);
    const comfPrice = getRandomPrice(9, 14);
    
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
        <h3>🚕 Smart Transfer</h3>
        <button class="st-close" id="st-close-btn">${t.close}</button>
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
      tar.addEventListener('click', function() {
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
      renderStep2();
    });
  }

  function renderStep2() {
    container.innerHTML = `
      <div class="st-header">
        <h3>🚕 Smart Transfer</h3>
        <button class="st-close" id="st-close-btn">${t.close}</button>
      </div>
      <div class="st-body st-loading">
        <div class="st-spinner"></div>
        <div style="color: #475569; font-weight: 500;">${t.findingDriver}</div>
      </div>
    `;
    document.getElementById('st-close-btn').addEventListener('click', hidePlugin);

    setTimeout(() => {
      renderStep3();
    }, 1500);
  }

  function renderStep3() {
    const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
    let remainingMins = driver.eta;
    let remainingSecs = 0;

    container.innerHTML = `
      <div class="st-header">
        <h3>🚕 Smart Transfer</h3>
        <button class="st-close" id="st-close-btn">${t.close}</button>
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
            <div>${t.arrivingIn}</div>
            <div class="st-eta-time" id="st-timer">${remainingMins}:00</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('st-close-btn').addEventListener('click', hidePlugin);

    const timerEl = document.getElementById('st-timer');
    
    if (currentCountdownInterval) clearInterval(currentCountdownInterval);
    
    currentCountdownInterval = setInterval(() => {
      if (remainingSecs === 0) {
        if (remainingMins === 0) {
          clearInterval(currentCountdownInterval);
          timerEl.textContent = "0:00";
          return;
        }
        remainingMins--;
        remainingSecs = 59;
      } else {
        remainingSecs--;
      }
      
      timerEl.textContent = `${remainingMins}:${remainingSecs.toString().padStart(2, '0')}`;
    }, 1000);
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
