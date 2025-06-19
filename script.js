// Устанавливаем целевую дату (18 июля 2025, 20:30 UTC+3)
const targetDate = new Date('2025-07-18T20:30:00+03:00');

function updateTimer() {
    const currentDate = new Date();
    const difference = targetDate - currentDate;

    // Если время истекло
    if (difference <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    // Вычисляем оставшееся время
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Обновляем отображение
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Обновляем таймер каждую секунду
setInterval(updateTimer, 1000);

// Запускаем таймер сразу при загрузке страницы
updateTimer();

// --- Firebase Auth Modal ---
const authModal = document.getElementById('authModal');
const openAuthModalBtn = document.getElementById('openAuthModal');
const closeAuthModalBtn = document.getElementById('closeAuthModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const authError = document.getElementById('authError');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authPasswordRepeat = document.getElementById('authPasswordRepeat');
const togglePassword = document.getElementById('togglePassword');
const togglePasswordRepeat = document.getElementById('togglePasswordRepeat');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const authModalTitle = document.querySelector('#authModal h3');

function showAuthModal(isRegister = false) {
  authModal.style.display = 'flex';
  authError.textContent = '';
  const passwordRepeatDiv = document.getElementById('authPasswordRepeat')?.parentElement;
  if (isRegister) {
    if (authModalTitle) authModalTitle.textContent = 'Регистрация';
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = '';
    if (passwordRepeatDiv) passwordRepeatDiv.style.display = '';
  } else {
    if (authModalTitle) authModalTitle.textContent = 'Вход';
    if (loginBtn) loginBtn.style.display = '';
    if (registerBtn) registerBtn.style.display = 'none';
    if (passwordRepeatDiv) passwordRepeatDiv.style.display = 'none';
  }
}
function hideAuthModal() {
  authModal.style.display = 'none';
  authEmail.value = '';
  authPassword.value = '';
  authPasswordRepeat.value = '';
  authError.textContent = '';
}
if (openAuthModalBtn) openAuthModalBtn.onclick = () => showAuthModal(false);
if (closeAuthModalBtn) closeAuthModalBtn.onclick = hideAuthModal;
window.onclick = function(e) {
  if (e.target === authModal) hideAuthModal();
};

// --- Перевод ошибок Firebase Auth на русский ---
function translateAuthError(error) {
  if (!error || !error.code) return error.message || 'Неизвестная ошибка';
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Некорректный email.';
    case 'auth/user-disabled':
      return 'Этот пользователь заблокирован.';
    case 'auth/user-not-found':
      return 'Пользователь с таким email не найден.';
    case 'auth/wrong-password':
      return 'Неверный пароль.';
    case 'auth/email-already-in-use':
      return 'Этот email уже зарегистрирован.';
    case 'auth/weak-password':
      return 'Слишком простой пароль. Минимум 6 символов.';
    case 'auth/missing-password':
      return 'Введите пароль.';
    case 'auth/too-many-requests':
      return 'Слишком много попыток. Попробуйте позже.';
    case 'auth/configuration-not-found':
      return 'В консоли Firebase не включён способ входа (Email/Password).';
    case 'auth/invalid-credential':
      return 'Ошибка: неверные или устаревшие данные для входа. Попробуйте ещё раз.';
    default:
      return error.message || 'Ошибка авторизации.';
  }
}
// --- END Перевод ошибок ---

loginBtn.onclick = async function() {
  try {
    await firebase.auth().signInWithEmailAndPassword(authEmail.value, authPassword.value);
    hideAuthModal();
  } catch (e) {
    authError.textContent = translateAuthError(e);
  }
};

if (togglePassword && authPassword) {
  togglePassword.onclick = function() {
    authPassword.type = authPassword.type === 'password' ? 'text' : 'password';
    togglePassword.querySelector('svg').style.fill = authPassword.type === 'password' ? '#888' : '#38ef7d';
  };
}
if (togglePasswordRepeat && authPasswordRepeat) {
  togglePasswordRepeat.onclick = function() {
    authPasswordRepeat.type = authPasswordRepeat.type === 'password' ? 'text' : 'password';
    togglePasswordRepeat.querySelector('svg').style.fill = authPasswordRepeat.type === 'password' ? '#888' : '#38ef7d';
  };
}

registerBtn.onclick = async function() {
  if (authPassword.value !== authPasswordRepeat.value) {
    authError.textContent = 'Пароли не совпадают!';
    return;
  }
  try {
    await firebase.auth().createUserWithEmailAndPassword(authEmail.value, authPassword.value);
    hideAuthModal();
  } catch (e) {
    authError.textContent = translateAuthError(e);
  }
};

if (googleAuthBtn) {
  googleAuthBtn.onclick = async function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
      hideAuthModal();
    } catch (e) {
      authError.textContent = translateAuthError(e);
    }
  };
}

// --- User Icon & Dropdown Menu ---
const userIcon = document.getElementById('userIcon');
const userMenu = document.getElementById('userMenu');
const userEmail = document.getElementById('userEmail');
const menuLogin = document.getElementById('menuLogin');
const menuRegister = document.getElementById('menuRegister');
const menuLogout = document.getElementById('menuLogout');

if (userIcon && userMenu) {
  userIcon.onclick = function(e) {
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    e.stopPropagation();
  };
  document.body.addEventListener('click', function() {
    userMenu.style.display = 'none';
  });
  userMenu.onclick = function(e) { e.stopPropagation(); };
}
if (menuLogin) menuLogin.onclick = function() {
  showAuthModal(false);
  userMenu.style.display = 'none';
};
if (menuRegister) menuRegister.onclick = function() {
  showAuthModal(true);
  userMenu.style.display = 'none';
};
if (menuLogout) menuLogout.onclick = function() {
  firebase.auth().signOut();
  userMenu.style.display = 'none';
};

// Обновление панели пользователя при изменении авторизации
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (userEmail) {
      userEmail.textContent = user.email;
      userEmail.style.display = window.innerWidth >= 600 ? '' : 'none';
    }
    if (menuLogin) menuLogin.style.display = 'none';
    if (menuRegister) menuRegister.style.display = 'none';
    if (menuLogout) menuLogout.style.display = '';
    // Добавляем email в userMenu на мобильных
    let menuEmail = document.getElementById('menuUserEmail');
    if (window.innerWidth < 600) {
      if (!menuEmail) {
        menuEmail = document.createElement('div');
        menuEmail.id = 'menuUserEmail';
        menuEmail.style.padding = '0.5rem 1rem';
        menuEmail.style.color = '#38ef7d';
        menuEmail.style.fontSize = '0.97rem';
        menuEmail.style.wordBreak = 'break-all';
        userMenu.insertBefore(menuEmail, userMenu.firstChild);
      }
      menuEmail.textContent = user.email;
      menuEmail.style.display = '';
    } else if (menuEmail) {
      menuEmail.style.display = 'none';
    }
  } else {
    if (userEmail) {
      userEmail.textContent = '';
      userEmail.style.display = 'none';
    }
    if (menuLogin) menuLogin.style.display = '';
    if (menuRegister) menuRegister.style.display = '';
    if (menuLogout) menuLogout.style.display = 'none';
    // Скрываем email в userMenu
    let menuEmail = document.getElementById('menuUserEmail');
    if (menuEmail) menuEmail.style.display = 'none';
  }
  if (userMenu) userMenu.style.display = 'none';
  loadRivers();
});
// --- END User Icon & Dropdown Menu ---

// --- Навигация по табам ---
const tabMain = document.getElementById('tabMain');
const tabRivers = document.getElementById('tabRivers');
const mainContent = document.getElementById('mainContent');
const riversContent = document.getElementById('riversContent');

if (tabMain && tabRivers && mainContent && riversContent) {
  tabMain.onclick = function() {
    tabMain.classList.add('active');
    tabRivers.classList.remove('active');
    mainContent.style.display = '';
    riversContent.style.display = 'none';
    tabMain.style.background = 'rgba(255,255,255,0.08)';
    tabRivers.style.background = 'transparent';
  };
  tabRivers.onclick = function() {
    tabMain.classList.remove('active');
    tabRivers.classList.add('active');
    mainContent.style.display = 'none';
    riversContent.style.display = '';
    tabMain.style.background = 'transparent';
    tabRivers.style.background = 'rgba(255,255,255,0.08)';
  };
}

// --- Firestore: Таблица рек ---
const riversTableBody = document.getElementById('riversTableBody');
const addRiverForm = document.getElementById('addRiverForm');
const filterInputs = document.querySelectorAll('.filter-input');
const thSortables = document.querySelectorAll('th.sortable');

let riversData = [];
let currentSort = { col: null, dir: 1 };
let currentFilters = {};
let editRiverId = null;

// Показывать форму только авторизованным
firebase.auth().onAuthStateChanged(user => {
  if (addRiverForm) {
    addRiverForm.style.display = 'none'; // всегда скрывать форму при смене авторизации
    addRiverForm.reset();
  }
  if (addRiverBtn) addRiverBtn.style.display = user ? '' : 'none';
  loadRivers();
});

const db = firebase.firestore();
const riversCollection = db.collection('rivers');

const addEditFormTitle = document.getElementById('addEditFormTitle');
const saveRiverBtn = document.getElementById('saveRiverBtn');

function renderRiversTable(data) {
  riversTableBody.innerHTML = '';
  const user = firebase.auth().currentUser;
  // --- Рендерим шапку с th для кнопок, если авторизован ---
  const theadRow = document.querySelector('#riversTable thead tr');
  if (theadRow) {
    const lastTh = theadRow.querySelector('th.action-col');
    if (lastTh) theadRow.removeChild(lastTh);
    if (user) {
      const th = document.createElement('th');
      th.className = 'action-col sortable';
      th.style.color = '#fff';
      th.style.fontWeight = '700';
      th.style.whiteSpace = 'nowrap';
      th.textContent = '';
      theadRow.appendChild(th);
    }
  }
  data.forEach(doc => {
    const d = doc;
    const tr = document.createElement('tr');
    let rowHtml = `
      <td>${d.name || ''}</td>
      <td>${d.region || ''}</td>
      <td>${d.section || ''}</td>
      <td>${d.ks || ''}</td>
      <td>${d.route || ''}</td>
      <td>${d.trainHours || ''}</td>
      <td>${d.transfer || ''}</td>
      <td>${d.links ? `<a href='${d.links}' target='_blank' style='color:#6cf;'>ссылка</a>` : ''}</td>
      <td>${d.comments || ''}</td>
      <td>${d.map ? `<a href='${d.map}' target='_blank' style='color:#6cf;'>карта</a>` : ''}</td>
      <td>${d.lastEdit || ''}</td>
    `;
    if (user) {
      rowHtml += `<td class='action-col'>
        <button class='editRiverBtn' data-id='${d.id}' aria-label='Редактировать' title='Редактировать' style='background:none;border:none;cursor:pointer;padding:0;margin-right:0.7rem;'>
          <span style='display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#007bff;transition:background 0.2s;'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z'/></svg>
          </span>
        </button>
        <button class='deleteRiverBtn' data-id='${d.id}' aria-label='Удалить' title='Удалить' style='background:none;border:none;cursor:pointer;padding:0;'>
          <span style='display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#c00;transition:background 0.2s;'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'/><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2'/><line x1='10' y1='11' x2='10' y2='17'/><line x1='14' y1='11' x2='14' y2='17'/></svg>
          </span>
        </button>
      </td>`;
    }
    tr.innerHTML = rowHtml;
    riversTableBody.appendChild(tr);
  });
}

function renderActiveFiltersBar() {
  const bar = document.getElementById('activeFiltersBar');
  bar.innerHTML = '';
  Object.entries(currentFilters).forEach(([col, val]) => {
    if (!val) return;
    const filterDiv = document.createElement('div');
    filterDiv.style.display = 'flex';
    filterDiv.style.alignItems = 'center';
    filterDiv.style.background = 'rgba(0,0,0,0.7)';
    filterDiv.style.color = '#fff';
    filterDiv.style.borderRadius = '16px';
    filterDiv.style.padding = '0.3rem 0.9rem 0.3rem 1.1rem';
    filterDiv.style.fontSize = '1rem';
    filterDiv.style.margin = '0.2rem 0';
    filterDiv.style.boxShadow = '0 2px 8px #0002';
    filterDiv.style.gap = '0.7rem';
    filterDiv.textContent = thTitles[col] + ' = ' + val;
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = '0.5rem';
    closeBtn.onclick = function() {
      delete currentFilters[col];
      applyFiltersAndSort();
    };
    filterDiv.appendChild(closeBtn);
    bar.appendChild(filterDiv);
  });
  bar.style.display = Object.keys(currentFilters).length ? 'flex' : 'none';
}

function applyFiltersAndSort() {
  let filtered = riversData.filter(row => {
    return Object.entries(currentFilters).every(([col, val]) => {
      if (!val) return true;
      return (row[col] || '').toLowerCase() === val.toLowerCase();
    });
  });
  if (currentSort.col) {
    filtered = filtered.slice().sort((a, b) => {
      const v1 = (a[currentSort.col] || '').toLowerCase();
      const v2 = (b[currentSort.col] || '').toLowerCase();
      if (v1 < v2) return -1 * currentSort.dir;
      if (v1 > v2) return 1 * currentSort.dir;
      return 0;
    });
  }
  renderRiversTable(filtered);
  renderActiveFiltersBar();
}

function loadRivers() {
  riversCollection.get().then(snapshot => {
    riversData = [];
    snapshot.forEach(doc => {
      riversData.push({ ...doc.data(), id: doc.id });
    });
    applyFiltersAndSort();
  });
}

if (tabRivers) {
  tabRivers.addEventListener('click', loadRivers);
}
if (riversContent && riversContent.style.display !== 'none') {
  loadRivers();
}

const addRiverBtn = document.getElementById('addRiverBtn');
const cancelAddRiverBtn = document.getElementById('cancelAddRiverBtn');

if (addRiverBtn) {
  addRiverBtn.onclick = function() {
    addRiverForm.style.display = 'flex';
    addRiverBtn.style.display = 'none';
    editRiverId = null;
    if (addEditFormTitle) {
      addEditFormTitle.textContent = 'Добавить новую реку';
      addEditFormTitle.style.display = 'block';
      addEditFormTitle.style.color = '#38ef7d';
    }
    if (saveRiverBtn) {
      saveRiverBtn.textContent = 'Сохранить';
      saveRiverBtn.style.background = '#38ef7d';
      saveRiverBtn.style.color = '#222';
    }
  };
}
if (cancelAddRiverBtn) {
  cancelAddRiverBtn.onclick = function() {
    addRiverForm.style.display = 'none';
    addRiverBtn.style.display = '';
    addRiverForm.reset();
    editRiverId = null;
    if (addEditFormTitle) addEditFormTitle.style.display = 'none';
  };
}
if (addRiverForm) {
  addRiverForm.onsubmit = async function(e) {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    const river = {
      name: document.getElementById('riverName').value,
      region: document.getElementById('riverRegion').value,
      section: document.getElementById('riverSection').value,
      ks: document.getElementById('riverKS').value,
      route: document.getElementById('riverRoute').value,
      trainHours: document.getElementById('riverTrainHours').value,
      transfer: document.getElementById('riverTransfer').value,
      links: document.getElementById('riverLinks').value,
      comments: document.getElementById('riverComments').value,
      map: document.getElementById('riverMap').value,
      lastEdit: user ? user.email : 'аноним'
    };
    try {
      if (editRiverId) {
        await riversCollection.doc(editRiverId).update(river);
        editRiverId = null;
      } else {
        await riversCollection.add(river);
      }
      addRiverForm.reset();
      addRiverForm.style.display = 'none';
      if (addRiverBtn) addRiverBtn.style.display = '';
      loadRivers();
    } catch (err) {
      alert('Ошибка при добавлении/редактировании: ' + err.message);
    }
  };
}

if (riversTableBody) {
  riversTableBody.onclick = async function(e) {
    const delBtn = e.target.closest('.deleteRiverBtn');
    const editBtn = e.target.closest('.editRiverBtn');
    if (delBtn) {
      if (confirm('Удалить эту запись?')) {
        try {
          await riversCollection.doc(delBtn.dataset.id).delete();
          loadRivers();
        } catch (err) {
          alert('Ошибка при удалении: ' + err.message);
        }
      }
    }
    if (editBtn) {
      const id = editBtn.dataset.id;
      const doc = riversData.find(r => r.id === id);
      if (!doc) return;
      editRiverId = id;
      // Заполняем форму
      addRiverForm.riverName.value = doc.name || '';
      addRiverForm.riverRegion.value = doc.region || '';
      addRiverForm.riverSection.value = doc.section || '';
      addRiverForm.riverKS.value = doc.ks || '';
      addRiverForm.riverRoute.value = doc.route || '';
      addRiverForm.riverTrainHours.value = doc.trainHours || '';
      addRiverForm.riverTransfer.value = doc.transfer || '';
      addRiverForm.riverLinks.value = doc.links || '';
      addRiverForm.riverComments.value = doc.comments || '';
      addRiverForm.riverMap.value = doc.map || '';
      addRiverForm.style.display = 'flex';
      if (addRiverBtn) addRiverBtn.style.display = 'none';
      if (addEditFormTitle) {
        addEditFormTitle.textContent = 'Редактировать реку';
        addEditFormTitle.style.display = 'block';
        addEditFormTitle.style.color = '#007bff';
      }
      if (saveRiverBtn) {
        saveRiverBtn.textContent = 'Сохранить изменения';
        saveRiverBtn.style.background = '#007bff';
        saveRiverBtn.style.color = '#fff';
      }
      addRiverForm.scrollIntoView({behavior:'smooth', block:'center'});
    }
  };
}

// --- Сортировка ---
const thTitles = {
  name: 'Название',
  region: 'Регион',
  section: 'Участок',
  ks: 'КС порогов',
  route: 'Поезд маршрут',
  trainHours: 'Поезд (часов)',
  transfer: 'Заброска/выброска (час)',
  links: 'Ссылки на описание',
  comments: 'Комментарии',
  map: 'Карта',
  lastEdit: 'Последнее изменение'
};
const filterSvg = "<span class='filter-icon' style='margin-left:6px;cursor:pointer;vertical-align:middle;'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24'><circle cx='11' cy='11' r='7' stroke='#fff' stroke-width='2'/><path d='M20 20l-3-3' stroke='#fff' stroke-width='2' stroke-linecap='round'/></svg></span>";

thSortables.forEach(th => {
  th.style.cursor = 'pointer';
  th.onclick = function(e) {
    if (e.target.closest('.filter-icon')) return;
    const col = th.dataset.col;
    if (currentSort.col === col) {
      currentSort.dir *= -1;
    } else {
      currentSort.col = col;
      currentSort.dir = 1;
    }
    thSortables.forEach(t => {
      const colKey = t.dataset.col;
      if (!colKey) return;
      t.innerHTML = thTitles[colKey] + filterSvg;
    });
    th.innerHTML = thTitles[col] + (currentSort.dir === 1 ? ' ▲' : ' ▼') + filterSvg;
    applyFiltersAndSort();
    attachFilterIconHandlers();
  };
});

function attachFilterIconHandlers() {
  document.querySelectorAll('.filter-icon').forEach(icon => {
    icon.onclick = function(e) {
      e.stopPropagation();
      const col = icon.dataset.col || icon.parentElement.dataset.col || icon.closest('th').dataset.col;
      const values = Array.from(new Set(riversData.map(r => (r[col] || '').trim()).filter(v => v)));
      values.sort();
      let dropdown = document.getElementById('filterDropdown');
      if (dropdown) dropdown.remove();
      dropdown = document.createElement('div');
      dropdown.id = 'filterDropdown';
      dropdown.style.position = 'absolute';
      dropdown.style.background = '#222';
      dropdown.style.color = '#fff';
      dropdown.style.border = '1px solid #444';
      dropdown.style.borderRadius = '8px';
      dropdown.style.zIndex = 10000;
      dropdown.style.minWidth = '140px';
      dropdown.style.maxHeight = '220px';
      dropdown.style.overflowY = 'auto';
      dropdown.style.boxShadow = '0 2px 12px #000';
      dropdown.style.fontSize = '1rem';
      dropdown.style.padding = '0.3rem 0';
      const rect = icon.getBoundingClientRect();
      dropdown.style.left = rect.left + window.scrollX + 'px';
      dropdown.style.top = rect.bottom + window.scrollY + 'px';
      values.forEach(val => {
        const item = document.createElement('div');
        item.textContent = val;
        item.style.padding = '0.5rem 1rem';
        item.style.cursor = 'pointer';
        item.onclick = function() {
          currentFilters[col] = val;
          dropdown.remove();
          applyFiltersAndSort();
        };
        dropdown.appendChild(item);
      });
      document.body.appendChild(dropdown);
      setTimeout(() => {
        document.addEventListener('click', function handler(ev) {
          if (!dropdown.contains(ev.target)) {
            dropdown.remove();
            document.removeEventListener('click', handler);
          }
        });
      }, 10);
    };
  });
}
attachFilterIconHandlers();
// --- END Firestore: Таблица рек --- 