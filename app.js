/**
 * Morning Dashboard - Bus C13 & Lycée (Épuré)
 * Voreppe (11 Novembre) ➔ Voiron (Edgar Kofler)
 */

const CONFIG = {
  lineId: 'SE2:C13',
  voreppe: {
    name: 'Avenue du 11 Novembre',
    city: 'Voreppe',
    stopGo: 'SE2:9027',     // Direction Voiron
    stopReturn: 'SE2:9028', // Direction Vizille/Grenoble
  },
  voiron: {
    name: 'Edgar Kofler',
    city: 'Voiron',
    stopGo: 'SE2:9031',     // Arrivée vers Voiron
    stopReturn: 'SE2:9032', // Départ retour vers Voreppe
  },
  weatherCoords: {
    lat: 45.298,
    lon: 5.637,
    city: 'Voreppe & Voiron'
  },
  refreshIntervalSec: 30,
  averageTripDurationMin: 23,
  // Horaires de secours si ficheHoraires ne couvre pas l'heure du cours
  fallbackTrips: [
    { depSec: 6*3600+30*60, arrSec: 6*3600+53*60 },
    { depSec: 7*3600+7*60,  arrSec: 7*3600+30*60 },
    { depSec: 7*3600+15*60, arrSec: 7*3600+38*60 },
    { depSec: 7*3600+33*60, arrSec: 7*3600+56*60 },
    { depSec: 8*3600+7*60,  arrSec: 8*3600+30*60 },
    { depSec: 8*3600+30*60, arrSec: 8*3600+53*60 },
  ],
  // Horaires hebdomadaires fournis par l'utilisateur
  defaultWeeklySchedule: {
    1: { name: 'Lundi', startTime: '08:30', courses: [
      { time: '08:30 - 09:30', subject: 'Mathématiques', room: 'B204', teacher: 'M. Lambert', code: 'maths' },
      { time: '09:30 - 10:30', subject: 'Histoire-Géographie', room: 'A102', teacher: 'Mme Girard', code: 'histoire' },
      { time: '10:45 - 12:45', subject: 'Physique-Chimie', room: 'Labo 2', teacher: 'M. Perrin', code: 'physique' },
      { time: '14:00 - 16:00', subject: 'Anglais LV1', room: 'C301', teacher: 'Mme Smith', code: 'anglais' },
      { time: '16:00 - 17:00', subject: 'Français', room: 'B105', teacher: 'Mme Roux', code: 'francais' }
    ]},
    2: { name: 'Mardi', startTime: '08:55', courses: [
      { time: '08:55 - 09:55', subject: 'Français', room: 'B105', teacher: 'Mme Roux', code: 'francais' },
      { time: '09:55 - 11:55', subject: 'SVT (Sciences)', room: 'Labo SVT 1', teacher: 'M. Morel', code: 'svt' },
      { time: '13:30 - 15:30', subject: 'EPS (Sport)', room: 'Gymnase Kofler', teacher: 'M. Fabre', code: 'eps' },
      { time: '15:45 - 17:45', subject: 'Espagnol LV2', room: 'C203', teacher: 'Mme Garcia', code: 'anglais' }
    ]},
    3: { name: 'Mercredi', startTime: '08:00', courses: [
      { time: '08:00 - 10:00', subject: 'Mathématiques', room: 'B204', teacher: 'M. Lambert', code: 'maths' },
      { time: '10:15 - 11:15', subject: 'Histoire-Géographie', room: 'A102', teacher: 'Mme Girard', code: 'histoire' },
      { time: '11:15 - 12:15', subject: 'Enseignement Scientifique', room: 'Amphi 1', teacher: 'Mme Bonnet', code: 'physique' }
    ]},
    4: { name: 'Jeudi', startTime: '08:30', courses: [
      { time: '08:30 - 10:30', subject: 'Physique-Chimie', room: 'Labo 2', teacher: 'M. Perrin', code: 'physique' },
      { time: '10:45 - 11:45', subject: 'Français', room: 'B105', teacher: 'Mme Roux', code: 'francais' },
      { time: '11:45 - 12:45', subject: 'Anglais LV1', room: 'C301', teacher: 'Mme Smith', code: 'anglais' },
      { time: '14:00 - 16:00', subject: 'Mathématiques', room: 'B204', teacher: 'M. Lambert', code: 'maths' },
      { time: '16:00 - 17:00', subject: 'EMC / Vie de classe', room: 'A102', teacher: 'Mme Girard', code: 'histoire' }
    ]},
    5: { name: 'Vendredi', startTime: '08:30', courses: [
      { time: '08:30 - 09:30', subject: 'Français', room: 'B105', teacher: 'Mme Roux', code: 'francais' },
      { time: '09:30 - 11:30', subject: 'Mathématiques', room: 'B204', teacher: 'M. Lambert', code: 'maths' },
      { time: '11:30 - 12:30', subject: 'Histoire-Géographie', room: 'A102', teacher: 'Mme Girard', code: 'histoire' },
      { time: '14:00 - 15:00', subject: 'Espagnol LV2', room: 'C203', teacher: 'Mme Garcia', code: 'anglais' },
      { time: '15:15 - 17:15', subject: 'SVT (Sciences)', room: 'Labo SVT 1', teacher: 'M. Morel', code: 'svt' }
    ]},
    6: { name: 'Samedi', startTime: null, courses: [] },
    0: { name: 'Dimanche', startTime: null, courses: [] }
  }
};

const state = {
  direction: 'GO',
  soundAlertEnabled: false,
  alertTriggeredForTrip: null,
  refreshCountdown: CONFIG.refreshIntervalSec,
  refreshTimer: null,
  nextBus: null,
  allTrips: [],
  weatherData: null,
  isFetching: false,
  activeScheduleTab: 'TODAY',
  weeklySchedule: {},
  pronoteUrl: ''
};

// ==========================================================================
// INITIALISATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedConfig();
  initClock();
  initChecklist();
  initEventListeners();
  fetchAllData();
  startRefreshTimer();
});

function loadSavedConfig() {
  const saved = localStorage.getItem('goodmorning_schedule_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.weeklySchedule = parsed.schedule || JSON.parse(JSON.stringify(CONFIG.defaultWeeklySchedule));
      state.pronoteUrl = parsed.pronoteUrl || '';
    } catch (e) {
      state.weeklySchedule = JSON.parse(JSON.stringify(CONFIG.defaultWeeklySchedule));
    }
  } else {
    state.weeklySchedule = JSON.parse(JSON.stringify(CONFIG.defaultWeeklySchedule));
  }
}

function saveScheduleConfig() {
  localStorage.setItem('goodmorning_schedule_config', JSON.stringify({
    schedule: state.weeklySchedule,
    pronoteUrl: state.pronoteUrl
  }));
}

// ==========================================================================
// HORLOGE & DATE
// ==========================================================================
function initClock() {
  const update = () => {
    const now = new Date();
    
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    const hEl = document.getElementById('clockHours');
    const mEl = document.getElementById('clockMinutes');
    const sEl = document.getElementById('clockSeconds');
    if (hEl) hEl.textContent = h;
    if (mEl) mEl.textContent = m;
    if (sEl) sEl.textContent = `:${s}`;

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = now.toLocaleDateString('fr-FR', options);
    const dateEl = document.getElementById('clockDate');
    if (dateEl) dateEl.textContent = dateStr;

    const greetingEl = document.getElementById('greetingText');
    if (greetingEl) {
      const hour = now.getHours();
      if (hour >= 5 && hour < 11) greetingEl.textContent = 'Bonne matinée !';
      else if (hour >= 11 && hour < 14) greetingEl.textContent = 'Bon midi !';
      else if (hour >= 14 && hour < 18) greetingEl.textContent = 'Bon après-midi !';
      else greetingEl.textContent = 'Bonsoir !';
    }

    updateHeroCountdown();
  };

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// ÉVÉNEMENTS
// ==========================================================================
function initEventListeners() {
  const dirGoBtn = document.getElementById('dirGoBtn');
  const dirReturnBtn = document.getElementById('dirReturnBtn');

  if (dirGoBtn && dirReturnBtn) {
    dirGoBtn.addEventListener('click', () => setDirection('GO'));
    dirReturnBtn.addEventListener('click', () => setDirection('RETURN'));
  }

  const tabTodayBtn = document.getElementById('tabTodayBtn');
  const tabTomorrowBtn = document.getElementById('tabTomorrowBtn');

  if (tabTodayBtn && tabTomorrowBtn) {
    tabTodayBtn.addEventListener('click', () => {
      state.activeScheduleTab = 'TODAY';
      tabTodayBtn.classList.add('active');
      tabTomorrowBtn.classList.remove('active');
      renderSchedule();
    });

    tabTomorrowBtn.addEventListener('click', () => {
      state.activeScheduleTab = 'TOMORROW';
      tabTomorrowBtn.classList.add('active');
      tabTodayBtn.classList.remove('active');
      renderSchedule();
    });
  }

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      state.refreshCountdown = CONFIG.refreshIntervalSec;
      fetchAllData(true);
    });
  }

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      state.soundAlertEnabled = !state.soundAlertEnabled;
      soundToggleBtn.style.color = state.soundAlertEnabled ? 'var(--emerald-400)' : '';
      if (state.soundAlertEnabled) playMorningChime();
    });
  }

  const testAudioBtn = document.getElementById('testAudioBtn');
  if (testAudioBtn) {
    testAudioBtn.addEventListener('click', playMorningChime);
  }

  const openConfigBtn = document.getElementById('openConfigBtn');
  const configModal = document.getElementById('configModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const saveScheduleBtn = document.getElementById('saveScheduleBtn');
  const resetDefaultScheduleBtn = document.getElementById('resetDefaultScheduleBtn');

  if (openConfigBtn && configModal && closeModalBtn) {
    openConfigBtn.addEventListener('click', () => {
      populateConfigModal();
      configModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
      configModal.classList.remove('open');
    });

    configModal.addEventListener('click', (e) => {
      if (e.target === configModal) configModal.classList.remove('open');
    });
  }

  if (saveScheduleBtn) {
    saveScheduleBtn.addEventListener('click', () => {
      readConfigModal();
      saveScheduleConfig();
      configModal.classList.remove('open');
      renderSchedule();
    });
  }

  if (resetDefaultScheduleBtn) {
    resetDefaultScheduleBtn.addEventListener('click', () => {
      state.weeklySchedule = JSON.parse(JSON.stringify(CONFIG.defaultWeeklySchedule));
      state.pronoteUrl = '';
      saveScheduleConfig();
      populateConfigModal();
      renderSchedule();
    });
  }
}

function setDirection(dir) {
  if (state.direction === dir) return;
  state.direction = dir;

  const dirGoBtn = document.getElementById('dirGoBtn');
  const dirReturnBtn = document.getElementById('dirReturnBtn');

  if (dir === 'GO') {
    dirGoBtn.classList.add('active');
    dirReturnBtn.classList.remove('active');
    document.getElementById('routeDirectionLabel').textContent = 'Direction Voiron';
    document.getElementById('routeSubTitle').textContent = '11 Novembre ➔ Edgar Kofler';
    document.getElementById('routeStopsSummary').textContent = 'Arrêt Avenue du 11 Novembre';
  } else {
    dirGoBtn.classList.remove('active');
    dirReturnBtn.classList.add('active');
    document.getElementById('routeDirectionLabel').textContent = 'Direction Voreppe';
    document.getElementById('routeSubTitle').textContent = 'Edgar Kofler ➔ 11 Novembre';
    document.getElementById('routeStopsSummary').textContent = 'Arrêt Edgar Kofler';
  }

  fetchAllData(true);
}

function startRefreshTimer() {
  if (state.refreshTimer) clearInterval(state.refreshTimer);

  state.refreshTimer = setInterval(() => {
    state.refreshCountdown--;
    const bar = document.getElementById('refreshProgressBar');
    if (bar) {
      const pct = (state.refreshCountdown / CONFIG.refreshIntervalSec) * 100;
      bar.style.width = `${Math.max(0, pct)}%`;
    }

    if (state.refreshCountdown <= 0) {
      state.refreshCountdown = CONFIG.refreshIntervalSec;
      fetchAllData();
    }
  }, 1000);
}

// ==========================================================================
// DONNÉES GLOBALES
// ==========================================================================
async function fetchAllData(manual = false) {
  if (state.isFetching) return;
  state.isFetching = true;

  const refreshIcon = document.getElementById('refreshIcon');
  if (refreshIcon) refreshIcon.classList.add('spinning');

  try {
    await Promise.all([
      fetchBusC13Data(),
      fetchWeatherData()
    ]);

    renderSchedule();

    const now = new Date();
    const lastUp = document.getElementById('lastUpdatedTime');
    if (lastUp) {
      lastUp.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
  } catch (err) {
    console.error('Erreur de synchronisation:', err);
  } finally {
    state.isFetching = false;
    if (refreshIcon) {
      setTimeout(() => refreshIcon.classList.remove('spinning'), 500);
    }
  }
}

// ==========================================================================
// BUS C13
// ==========================================================================
async function fetchBusC13Data() {
  const isGo = state.direction === 'GO';
  const originStopId = isGo ? CONFIG.voreppe.stopGo : CONFIG.voiron.stopReturn;
  const destStopId = isGo ? CONFIG.voiron.stopGo : CONFIG.voreppe.stopReturn;

  try {
    const realtimeUrl = `https://data.mobilites-m.fr/api/routers/default/index/stops/${originStopId}/stoptimes`;
    const ficheUrl = `https://data.mobilites-m.fr/api/ficheHoraires/json?route=${CONFIG.lineId.replace(':', '_')}`;

    const [realtimeRes, ficheRes] = await Promise.all([
      fetch(realtimeUrl, { headers: { Origin: 'goodmorning-dashboard' } }),
      fetch(ficheUrl, { headers: { Origin: 'goodmorning-dashboard' } })
    ]);

    // Temps réel : indexer par tripId
    const realtimeByTrip = {};
    if (realtimeRes.ok) {
      const realtimeData = await realtimeRes.json();
      if (Array.isArray(realtimeData)) {
        realtimeData.forEach(pattern => {
          (pattern.times || []).forEach(t => {
            if (t.tripId) realtimeByTrip[t.tripId] = t;
          });
        });
      }
    }

    // ficheHoraires : extraire les horaires planifiés de l'arrêt origine et destination
    const trips = [];
    if (ficheRes.ok) {
      const ficheData = await ficheRes.json();
      // Parcourir les deux directions disponibles
      Object.values(ficheData).forEach(direction => {
        const arrets = direction.arrets || [];
        const originStop = arrets.find(a => a.stopId === originStopId);
        const destStop = arrets.find(a => a.stopId === destStopId);
        if (!originStop) return;

        const tripIds = (direction.trips || []).map(t => t.tripId);

        originStop.trips.forEach((depVal, idx) => {
          if (depVal === '|' || depVal === null) return;
          const depSec = Number(depVal);
          if (isNaN(depSec)) return;

          const tripId = tripIds[idx] || `sched-${depSec}`;
          const rt = realtimeByTrip[tripId];

          const isRealtime = Boolean(rt?.realtime);
          const finalDepSec = isRealtime ? rt.realtimeDeparture : depSec;
          const delaySec = rt?.departureDelay || 0;

          let arrSec = finalDepSec + CONFIG.averageTripDurationMin * 60;
          if (destStop) {
            const arrVal = destStop.trips[idx];
            if (arrVal !== '|' && arrVal !== null && !isNaN(Number(arrVal))) {
              const plannedArr = Number(arrVal);
              const dur = Math.round((plannedArr - depSec) / 60);
              if (dur >= 10 && dur <= 60) {
                arrSec = isRealtime ? plannedArr + delaySec : plannedArr;
              }
            }
          }

          trips.push({
            tripId,
            stopName: originStop.stopName,
            depSec: finalDepSec,
            arrSec,
            delaySec,
            isRealtime,
            realtimeState: rt?.realtimeState || null,
            occupancy: rt?.occupancy || 'Faible',
            cancelled: Boolean(rt?.cancelled)
          });
        });
      });
    }

    trips.sort((a, b) => a.depSec - b.depSec);
    const nowSec = getSecondsFromMidnight();
    const upcomingTrips = trips.filter(t => t.depSec >= (nowSec - 60));
    state.allTrips = upcomingTrips.length > 0 ? upcomingTrips : trips;
    state.nextBus = state.allTrips[0] || null;

    renderBusHero();
    renderTimetable();
    checkSoundAlert();

  } catch (err) {
    console.error('Erreur API Bus C13:', err);
  }
}



// ==========================================================================
// AFFICHAGE HERO BUS
// ==========================================================================
function renderBusHero() {
  const next = state.nextBus;
  if (!next) {
    document.getElementById('heroCountdown').textContent = '-- min';
    document.getElementById('heroDepTime').textContent = '--:--';
    document.getElementById('heroArrTime').textContent = '--:--';
    return;
  }

  document.getElementById('heroDepTime').textContent = formatSecondsToTime(next.depSec);
  document.getElementById('heroArrTime').textContent = formatSecondsToTime(next.arrSec);

  const durationMin = Math.round((next.arrSec - next.depSec) / 60);
  document.getElementById('heroDuration').textContent = `~${durationMin} min de trajet`;

  const delayBadge = document.getElementById('heroDelayBadge');
  const delayMin = Math.round(next.delaySec / 60);

  if (delayBadge) {
    if (!next.isRealtime) {
      delayBadge.className = 'delay-badge ontime';
      delayBadge.textContent = 'Planifié';
    } else if (delayMin === 0) {
      delayBadge.className = 'delay-badge ontime';
      delayBadge.textContent = 'À l\'heure';
    } else if (delayMin > 0) {
      delayBadge.className = 'delay-badge late';
      delayBadge.textContent = `+${delayMin}m retard`;
    } else {
      delayBadge.className = 'delay-badge early';
      delayBadge.textContent = `${delayMin}m avance`;
    }
  }

  const livePill = document.getElementById('liveStatusPill');
  const liveText = document.getElementById('liveStatusText');
  if (livePill && liveText) {
    liveText.textContent = next.isRealtime ? 'Temps réel' : 'Planifié';
  }

  updateHeroCountdown();
}

function updateHeroCountdown() {
  const next = state.nextBus;
  if (!next) return;

  const nowSec = getSecondsFromMidnight();
  const diffSec = next.depSec - nowSec;
  const countdownEl = document.getElementById('heroCountdown');
  const adviceIcon = document.getElementById('adviceIcon');
  const adviceText = document.getElementById('adviceText');

  if (diffSec <= -60) {
    fetchAllData();
    return;
  }

  const diffMin = Math.floor(diffSec / 60);
  const remainingSec = Math.abs(diffSec % 60);

  if (countdownEl) {
    if (diffSec < 0) {
      countdownEl.textContent = 'À l\'arrêt';
      countdownEl.style.color = 'var(--rose-400)';
    } else if (diffMin === 0) {
      countdownEl.textContent = `${remainingSec}s`;
      countdownEl.style.color = 'var(--rose-400)';
    } else {
      countdownEl.textContent = `${diffMin} min`;
      countdownEl.style.color = diffMin <= 5 ? 'var(--rose-400)' : 'var(--amber-400)';
    }
  }

  if (adviceIcon && adviceText) {
    if (diffMin > 18) {
      adviceIcon.textContent = '☕';
      adviceText.textContent = `Prochain départ dans ${diffMin} min. Tu as le temps.`;
    } else if (diffMin >= 8 && diffMin <= 18) {
      adviceIcon.textContent = '🎒';
      adviceText.textContent = `Départ dans ${diffMin} min. Prépare ton sac et tes affaires.`;
    } else if (diffMin >= 3 && diffMin < 8) {
      adviceIcon.textContent = '👟';
      adviceText.textContent = `Départ dans ${diffMin} min. Pars vers l'arrêt 11 Novembre !`;
    } else if (diffMin >= 0 && diffMin < 3) {
      adviceIcon.textContent = '🏃‍♂️';
      adviceText.textContent = `Bus imminent dans ${diffMin + 1} min à l'arrêt !`;
    } else {
      adviceIcon.textContent = '🚌';
      adviceText.textContent = 'Le bus C13 passe actuellement.';
    }
  }
}

function renderTimetable() {
  const container = document.getElementById('timetableList');
  const countEl = document.getElementById('timetableCount');
  if (!container) return;

  const trips = state.allTrips.slice(1, 6);
  if (countEl) countEl.textContent = `${trips.length + (state.nextBus ? 1 : 0)} départs`;

  if (trips.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Pas d'autre départ immédiat.</p></div>`;
    return;
  }

  const nowSec = getSecondsFromMidnight();

  container.innerHTML = trips.map(t => {
    const depTime = formatSecondsToTime(t.depSec);
    const arrTime = formatSecondsToTime(t.arrSec);
    const diffMin = Math.round((t.depSec - nowSec) / 60);
    const durationMin = Math.round((t.arrSec - t.depSec) / 60);

    return `
      <div class="trip-item">
        <div class="trip-left">
          <span class="trip-dep-time">${depTime}</span>
          <span class="trip-meta">dans ${diffMin} min</span>
        </div>
        <div class="trip-right">
          <span class="trip-arr-time">${arrTime}</span>
          <span class="trip-duration-tag">~${durationMin} min</span>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// MÉTÉO SIMPLIFIÉE (MATIN & APRÈS-MIDI)
// ==========================================================================
async function fetchWeatherData() {
  const { lat, lon } = CONFIG.weatherCoords;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FParis`;

  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    state.weatherData = data;
    renderSimpleWeather(data);
  } catch (err) {
    console.error('Erreur météo:', err);
  }
}

function renderSimpleWeather(data) {
  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  if (!current || !hourly || !hourly.time) return;

  // Température actuelle sommaire
  const currTemp = Math.round(current.temperature_2m);
  const currEl = document.getElementById('weatherCurrentSummary');
  if (currEl) currEl.textContent = `Actuel : ${currTemp}°C`;

  // Matin (Moyenne 8h - 11h)
  const morningIndices = [];
  const afternoonIndices = [];
  const todayDate = new Date().getDate();

  for (let i = 0; i < hourly.time.length; i++) {
    const d = new Date(hourly.time[i]);
    if (d.getDate() === todayDate) {
      const h = d.getHours();
      if (h >= 8 && h <= 11) morningIndices.push(i);
      if (h >= 13 && h <= 17) afternoonIndices.push(i);
    }
  }

  // Calcul Matin
  let mTemp = Math.round(daily.temperature_2m_min[0]);
  let mCode = 0;
  let mRain = 0;
  if (morningIndices.length > 0) {
    const idx = morningIndices[0];
    mTemp = Math.round(hourly.temperature_2m[idx]);
    mCode = hourly.weather_code[idx];
    mRain = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;
  }
  const mInfo = getWeatherInfo(mCode, 1);

  document.getElementById('morningTemp').textContent = `${mTemp}°C`;
  document.getElementById('morningIcon').textContent = mInfo.icon;
  document.getElementById('morningDesc').textContent = mInfo.desc;
  document.getElementById('morningRain').textContent = `💧 Pluie : ${mRain}%`;
  document.getElementById('morningTip').textContent = mTemp < 15 ? '🧥 Veste légère' : (mRain >= 30 ? '☔ Parapluie' : '👕 T-shirt');

  // Calcul Après-midi
  let aTemp = Math.round(daily.temperature_2m_max[0]);
  let aCode = 0;
  let aRain = 0;
  if (afternoonIndices.length > 0) {
    const idx = afternoonIndices[afternoonIndices.length - 1];
    aTemp = Math.round(hourly.temperature_2m[idx]);
    aCode = hourly.weather_code[idx];
    aRain = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;
  }
  const aInfo = getWeatherInfo(aCode, 1);

  document.getElementById('afternoonTemp').textContent = `${aTemp}°C`;
  document.getElementById('afternoonIcon').textContent = aInfo.icon;
  document.getElementById('afternoonDesc').textContent = aInfo.desc;
  document.getElementById('afternoonRain').textContent = `💧 Pluie : ${aRain}%`;
  document.getElementById('afternoonTip').textContent = aTemp >= 27 ? '💧 Gourde d\'eau' : (aRain >= 30 ? '☔ Parapluie' : '☀️ Beau temps');
}

function getWeatherInfo(code, isDay = 1) {
  switch (code) {
    case 0: return { desc: 'Ciel dégagé', icon: isDay ? '☀️' : '🌙' };
    case 1:
    case 2: return { desc: 'Éclaircies', icon: isDay ? '🌤️' : '☁️' };
    case 3: return { desc: 'Nuageux', icon: '☁️' };
    case 45:
    case 48: return { desc: 'Brouillard', icon: '🌫️' };
    case 51:
    case 53:
    case 55: return { desc: 'Bruine', icon: '🌦️' };
    case 61:
    case 63:
    case 65: return { desc: 'Pluie', icon: '🌧️' };
    case 80:
    case 81:
    case 82: return { desc: 'Averses', icon: '🌧️' };
    case 95: return { desc: 'Orage', icon: '⛈️' };
    default: return { desc: 'Variable', icon: '⛅' };
  }
}

// ==========================================================================
// EMPLOI DU TEMPS DU LYCÉE
// ==========================================================================
function renderSchedule() {
  const isTomorrow = state.activeScheduleTab === 'TOMORROW';
  const targetDate = new Date();
  if (isTomorrow) targetDate.setDate(targetDate.getDate() + 1);

  const dayOfWeek = targetDate.getDay();
  const daySchedule = state.weeklySchedule[dayOfWeek] || { name: 'Repos', startTime: null, courses: [] };

  const dayNameEl = document.getElementById('summaryDayName');
  const startTimeEl = document.getElementById('summaryStartTime');
  const busTimeEl = document.getElementById('summaryBusTime');
  const busMarginEl = document.getElementById('summaryBusMargin');
  const container = document.getElementById('coursesList');

  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  if (dayNameEl) dayNameEl.textContent = targetDate.toLocaleDateString('fr-FR', options);

  if (!daySchedule.startTime) {
    if (startTimeEl) startTimeEl.textContent = 'Pas de cours';
    if (busTimeEl) busTimeEl.textContent = '-';
    if (busMarginEl) busMarginEl.textContent = '(Grasse matinée 🎉)';
    if (container) {
      container.innerHTML = `<div class="empty-state"><p>🎉 Aucun cours prévu ce jour-là.</p></div>`;
    }
    return;
  }

  if (startTimeEl) startTimeEl.textContent = daySchedule.startTime.replace(':', 'h');

  // Bus conseillé : dernier trip qui arrive à Voiron avec au moins 10 min d'avance
  const [classH, classM] = daySchedule.startTime.split(':').map(Number);
  const classSec = classH * 3600 + classM * 60;

  // Chercher dans les trips API, sinon fallback sur la liste statique
  const apiCandidates = state.allTrips.filter(t => t.arrSec <= classSec - 10 * 60);
  const tripsToSearch = apiCandidates.length > 0 ? state.allTrips : CONFIG.fallbackTrips;
  const advisedTrip = tripsToSearch
    .filter(t => t.arrSec <= classSec - 10 * 60)
    .at(-1);

  if (advisedTrip) {
    const marginMin = Math.round((classSec - advisedTrip.arrSec) / 60);
    if (busTimeEl) busTimeEl.textContent = formatSecondsToTime(advisedTrip.depSec).replace(':', 'h');
    if (busMarginEl) busMarginEl.textContent = `(${marginMin} min d'avance)`;
  } else {
    if (busTimeEl) busTimeEl.textContent = '-';
    if (busMarginEl) busMarginEl.textContent = '(aucun bus disponible)';
  }

  // Liste des cours
  if (container) {
    if (!daySchedule.courses || daySchedule.courses.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>Aucun cours enregistré.</p></div>`;
      return;
    }

    container.innerHTML = daySchedule.courses.map((c, idx) => `
      <div class="course-item is-${c.code || 'maths'}">
        <div class="course-left">
          <span class="course-subject">${c.subject}</span>
          <span class="course-teacher">${c.teacher}</span>
        </div>
        <div class="course-right">
          <span class="course-time">${c.time}</span>
          <span class="course-room-badge">${c.room}</span>
        </div>
      </div>
    `).join('');
  }
}

// ==========================================================================
// CHECKLIST (LocalStorage)
// ==========================================================================
function initChecklist() {
  const saved = localStorage.getItem('goodmorning_checklist');
  if (saved) {
    try {
      const stateObj = JSON.parse(saved);
      document.querySelectorAll('.check-input').forEach(input => {
        const id = input.getAttribute('data-id');
        if (stateObj[id] !== undefined) input.checked = stateObj[id];
      });
    } catch (e) {}
  }

  document.querySelectorAll('.check-input').forEach(input => {
    input.addEventListener('change', () => {
      const stateObj = {};
      document.querySelectorAll('.check-input').forEach(i => {
        stateObj[i.getAttribute('data-id')] = i.checked;
      });
      localStorage.setItem('goodmorning_checklist', JSON.stringify(stateObj));
    });
  });

  const resetBtn = document.getElementById('resetChecklistBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.check-input').forEach(i => i.checked = false);
      localStorage.removeItem('goodmorning_checklist');
    });
  }
}

// ==========================================================================
// MODAL HORAIRES
// ==========================================================================
function populateConfigModal() {
  const sched = state.weeklySchedule;
  const setVal = (id, dayKey) => {
    const el = document.getElementById(id);
    if (el && sched[dayKey]) el.value = sched[dayKey].startTime || '';
  };

  setVal('timeLundi', 1);
  setVal('timeMardi', 2);
  setVal('timeMercredi', 3);
  setVal('timeJeudi', 4);
  setVal('timeVendredi', 5);

  const urlInput = document.getElementById('pronoteUrlInput');
  if (urlInput) urlInput.value = state.pronoteUrl || '';
}

function readConfigModal() {
  const getVal = id => {
    const el = document.getElementById(id);
    return el ? el.value : '08:30';
  };

  if (state.weeklySchedule[1]) state.weeklySchedule[1].startTime = getVal('timeLundi');
  if (state.weeklySchedule[2]) state.weeklySchedule[2].startTime = getVal('timeMardi');
  if (state.weeklySchedule[3]) state.weeklySchedule[3].startTime = getVal('timeMercredi');
  if (state.weeklySchedule[4]) state.weeklySchedule[4].startTime = getVal('timeJeudi');
  if (state.weeklySchedule[5]) state.weeklySchedule[5].startTime = getVal('timeVendredi');

  const urlInput = document.getElementById('pronoteUrlInput');
  if (urlInput) state.pronoteUrl = urlInput.value.trim();
}

// ==========================================================================
// ALERTE & AUDIO
// ==========================================================================
function checkSoundAlert() {
  if (!state.soundAlertEnabled || !state.nextBus) return;

  const nowSec = getSecondsFromMidnight();
  const diffSec = state.nextBus.depSec - nowSec;
  const diffMin = Math.floor(diffSec / 60);

  if (diffMin <= 5 && diffMin >= 4 && state.alertTriggeredForTrip !== state.nextBus.tripId) {
    state.alertTriggeredForTrip = state.nextBus.tripId;
    playMorningChime();
  }
}

function playMorningChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + idx * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.15);
      osc.stop(ctx.currentTime + idx * 0.15 + 0.55);
    });
  } catch (e) {}
}

function getSecondsFromMidnight() {
  const now = new Date();
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

function formatSecondsToTime(totalSec) {
  if (totalSec === null || totalSec === undefined) return '--:--';
  const secNorm = ((totalSec % 86400) + 86400) % 86400;
  const h = Math.floor(secNorm / 3600);
  const m = Math.floor((secNorm % 3600) / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
