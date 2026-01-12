
// Получаем элементы DOM (с проверкой существования)
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const buyButtons = document.querySelectorAll('.buy-btn');
const selectedPackage = document.getElementById('selected-package');
const paymentForm = document.getElementById('payment-form');

// Функция закрытия модального окна
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto'; // Возвращаем скролл

    // Очищаем форму после закрытия
    if (paymentForm) {
        paymentForm.reset();
    }
}

// Открываем модальное окно при нажатии на кнопку «Купить»
if (buyButtons.length > 0) {
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageName = this.getAttribute('data-package');
            if (selectedPackage && modal) {
                selectedPackage.textContent = packageName;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Блокируем скролл
            }
        });
    });
}

// Закрываем модальное окно
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// Закрываем модальное окно при клике вне его
window.addEventListener('click', function(event) {
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Базовые URL для разных способов оплаты
const paymentUrls = {
    card: 'https://yoomoney.ru/bill/pay/1F897L2BEEK.260112',
    qiwi: 'https://qiwi.com/payment/form/99',
    crypto: 'https://crypto-gateway.com/pay'
};

// Обработчик кликов по ссылкам оплаты
document.querySelectorAll('.payment-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const method = this.getAttribute('data-method');
        const packageName = selectedPackage ? selectedPackage.textContent : '';
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');

        if (!usernameInput || !emailInput) {
            showErrorMessage('Не удалось найти поля формы');
            return;
        }

        const username = usernameInput.value;
        const email = emailInput.value;

        // Валидация формы перед генерацией ссылки
        if (!validateForm(username, email, method)) {
            return;
        }

        // Генерируем ссылку с параметрами
        const baseUrl = paymentUrls[method];
        if (!baseUrl) {
            showErrorMessage('Неверный способ оплаты');
            return;
        }

        const paymentLink = `${baseUrl}?package=${encodeURIComponent(packageName)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;

        // Открываем в новой вкладке
        window.open(paymentLink, '_blank');
    });
});

// Обновлённая функция валидации формы
function validateForm(username, email, paymentMethod) {
    let isValid = true;
    let errorMessage = '';

    if (!username || username.trim().length < 3) {
        errorMessage = 'Ник должен содержать минимум 3 символа.';
        isValid = false;
    } else if (!isValidEmail(email)) {
        errorMessage = 'Введите корректный email-адрес.';
        isValid = false;
    }

    if (!isValid) {
        showErrorMessage(errorMessage);
    }

    return isValid;
}

// Проверка email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Показать индикатор загрузки
function showLoading() {
    const submitButton = paymentForm ? paymentForm.querySelector('button[type="submit"]') : null;
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Обработка... <span class="loading-dots">...</span>';
    }
}

// Скрыть индикатор загрузки
function hideLoading() {
    const submitButton = paymentForm ? paymentForm.querySelector('button[type="submit"]') : null;
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Перейти к оплате';
    }
}

// Показать сообщение об успехе
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

// Показать сообщение об ошибке
function showErrorMessage(message) {
    showNotification(message, 'error');
}

// Показать уведомление
function showNotification(message, type) {
    // Удаляем старые уведомления
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
}


// Элементы DOM для профиля
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const editProfileBtn = document.getElementById('editProfileBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const rechargeBtn = document.getElementById('rechargeBtn');
const logoutBtn = document.getElementById('logoutBtn');
const profileView = document.getElementById('profileView');
const profileEdit = document.getElementById('profileEdit');
const editProfileForm = document.getElementById('editProfileForm');

// Данные пользователя
let userData = loadProfileData() || {
    username: 'Гость',
    privilege: 'Нет',
    balance: '0 руб.',
    email: 'Не указан',
    regDate: '—',
    avatar: 'Г'
};

// Функция обновления данных профиля
function updateProfileDisplay(profileData = userData) {
    const profileUsername = document.getElementById('profileUsername');
    const profilePrivilege = document.getElementById('profilePrivilege');
    const profileBalance = document.getElementById('profileBalance');
    const profileEmail = document.getElementById('profileEmail');
    const profileRegDate = document.getElementById('profileRegDate');
    const avatarElements = document.querySelectorAll('.avatar');
    const avatarLarge = document.querySelector('.avatar-large');
    const usernameElement = document.querySelector('.username');

    if (profileUsername) profileUsername.textContent = profileData.username || 'Гость';
    if (profilePrivilege) profilePrivilege.textContent = profileData.privilege || 'Нет';
    if (profileBalance) profileBalance.textContent = profileData.balance || '0 руб.';
    if (profileEmail) profileEmail.textContent = profileData.email || 'Не указан';
    if (profileRegDate) profileRegDate.textContent = profileData.regDate || '—';

    // Обновляем аватар в шапке и в профиле
    avatarElements.forEach(el => {
        if (el) el.textContent = profileData.avatar || 'Г';
    });
    if (avatarLarge) avatarLarge.textContent = profileData.avatar || 'Г';

    // Обновляем ник в шапке
    if (usernameElement) usernameElement.textContent = profileData.username || 'Гость';
}

// Открытие модального окна профиля
if (profileBtn) {
    profileBtn.addEventListener('click', function() {
        updateProfileDisplay();
        if (profileModal) profileModal.style.display = 'block';
    });
}

// Закрытие модального окна профиля
if (closeProfileModal) {
    closeProfileModal.addEventListener('click', function() {
        if (profileModal) profileModal.style.display = 'none';
        showProfileView(); // Возвращаемся к виду профиля при закрытии
    });
}

// Переход в режим редактирования
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
        showProfileEdit();

        // Заполняем форму текущими данными
        const editUsername = document.getElementById('editUsername');
        const editEmail = document.getElementById('editEmail');
        const editAvatar = document.getElementById('editAvatar');

        if (editUsername) {
            editUsername.value = userData.username || '';
        } else {
            console.warn('Элемент #editUsername не найден в DOM');
        }

        if (editEmail) {
            editEmail.value = userData.email || '';
        } else {
            console.warn('Элемент #editEmail не найден в DOM');
        }

        if (editAvatar) {
            editAvatar.value = userData.avatar || 'Г';
        } else {
            console.warn('Элемент #editAvatar не найден в DOM');
        }
    });
}

// Функция форматирования даты в формат ДД.ММ.ГГГГ
function formatDate(date) {
    if (!(date instanceof Date)) {
        return '—';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц +1, т.к. отсчёт с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

// Функция загрузки данных профиля из localStorage
function loadProfileData() {
    try {
        const saved = localStorage.getItem('gladyProfile');
        if (saved) {
            const data = JSON.parse(saved);
            // Гарантируем наличие даты регистрации
            if (!data.regDate) {
                data.regDate = formatDate(new Date());
                saveProfileData(data);
            }
            return data;
        }
        return null;
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        return null;
    }
}

// Функция сохранения данных профиля в localStorage
function saveProfileData(data) {
    // Устанавливаем дату регистрации только если её ещё нет (для новых пользователей)
    if (!data.regDate) {
        data.regDate = formatDate(new Date());
    }
    localStorage.setItem('gladyProfile', JSON.stringify(data));
}

// Данные пользователя
let userData = loadProfileData() || {
    username: 'Гость',
    privilege: 'Нет',
    balance: '0 руб.',
    email: 'Не указан',
    regDate: formatDate(new Date()), // Текущая дата при создании нового профиля
    avatar: 'Г'
};

// Функция обновления данных профиля
function updateProfileDisplay(profileData = userData) {
    const profileUsername = document.getElementById('profileUsername');
    const profilePrivilege = document.getElementById('profilePrivilege');
    const profileBalance = document.getElementById('profileBalance');
    const profileEmail = document.getElementById('profileEmail');
    const profileRegDate = document.getElementById('profileRegDate');
    const avatarElements = document.querySelectorAll('.avatar');
    const avatarLarge = document.querySelector('.avatar-large');
    const usernameElement = document.querySelector('.username');

    if (profileUsername) profileUsername.textContent = profileData.username || 'Гость';
    if (profilePrivilege) profilePrivilege.textContent = profileData.privilege || 'Нет';
    if (profileBalance) profileBalance.textContent = profileData.balance || '0 руб.';
    if (profileEmail) profileEmail.textContent = profileData.email || 'Не указан';
    if (profileRegDate) profileRegDate.textContent = profileData.regDate || '—';

    // Обновляем аватар в шапке и в профиле
    avatarElements.forEach(el => {
        if (el) el.textContent = profileData.avatar || 'Г';
    });
    if (avatarLarge) avatarLarge.textContent = profileData.avatar || 'Г';

    // Обновляем ник в шапке
    if (usernameElement) usernameElement.textContent = profileData.username || 'Гость';
}

// Переход в режим редактирования
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
        showProfileEdit();

        // Заполняем форму текущими данными
        const editUsername = document.getElementById('editUsername');
        const editEmail = document.getElementById('editEmail');
        const editAvatar = document.getElementById('editAvatar');
        const editRegDate = document.getElementById('editRegDate'); // Новое поле

        if (editUsername) editUsername.value = userData.username || '';
        if (editEmail) editEmail.value = userData.email || '';
        if (editAvatar) editAvatar.value = userData.avatar || 'Г';
        if (editRegDate) editRegDate.value = userData.regDate || formatDate(new Date()); // Заполняем дату
    });
}

// Сохранение изменений профиля
if (editProfileForm) {
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Получаем данные из формы
        const editRegDate = document.getElementById('editRegDate');

        // Обновляем данные пользователя
        userData.username = document.getElementById('editUsername').value.trim();
        userData.email = document.getElementById('editEmail').value.trim();
        userData.avatar = document.getElementById('editAvatar').value.trim().toUpperCase();

        // Сохраняем дату регистрации, если она есть
        if (editRegDate && editRegDate.value) {
            userData.regDate = editRegDate.value;
        }

        // Сохраняем в localStorage
        saveProfileData(userData);

        // Обновляем отображение
        updateProfileDisplay(userData);
        showProfileView();

        showSuccessMessage('Профиль успешно обновлён!');
    });
}

