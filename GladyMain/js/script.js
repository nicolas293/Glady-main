// Получаем элементы DOM
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const buyButtons = document.querySelectorAll('.buy-btn');
const selectedPackage = document.getElementById('selected-package');
const paymentForm = document.getElementById('payment-form');

// Открываем модальное окно при нажатии на кнопку «Купить»
buyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const packageName = this.getAttribute('data-package');
        selectedPackage.textContent = packageName;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокируем скролл
    });
});

// Закрываем модальное окно
closeBtn.addEventListener('click', closeModal);

// Закрываем модальное окно при клике вне его
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Функция закрытия модального окна
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Возвращаем скролл

    // Очищаем форму после закрытия
    paymentForm.reset();
}

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
        const packageName = document.getElementById('selected-package').textContent;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;

        // Валидация формы перед генерацией ссылки
        if (!validateForm(username, email, method)) {
            return;
        }

        // Генерируем ссылку с параметрами
        const baseUrl = paymentUrls[method];
        const paymentLink = `${baseUrl}?package=${encodeURIComponent(packageName)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;

        // Открываем в новой вкладке
        window.open(paymentLink, '_blank');
    });
});

// Обновлённая функция валидации формы
function validateForm(username, email, paymentMethod) {
    let isValid = true;
    let errorMessage = '';

    if (username.trim().length < 3) {
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

// Имитация платежа (в реальном проекте замените на API-запрос)
async function simulatePayment(username, email, packageName, paymentMethod) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // В 80 % случаев имитируем успех
            const success = Math.random() > 0.2;

            if (success) {
                resolve({
                    success: true,
                    message: `Оплата за пакет «${packageName}» успешно завершена! Привилегия активирована.`
                });
            } else {
                resolve({
                    success: false,
                    message: 'Ошибка оплаты. Проверьте данные и попробуйте снова.'
                });
            }
        }, 2000); // Имитация задержки сети
    });
}

// Показать индикатор загрузки
function showLoading() {
    const submitButton = paymentForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Обработка... <span class="loading-dots">...</span>';
}

// Скрыть индикатор загрузки
function hideLoading() {
    const submitButton = paymentForm.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = 'Перейти к оплате';
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

// Сбросить форму
function resetForm() {
    paymentForm.reset();
}

// Элементы DOM
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

// Данные пользователя (в реальном приложении будут загружаться с сервера)
let userData = {
    username: 'Гость',
    privilege: 'Нет',
    balance: '0 руб.',
    email: 'Не указан',
    regDate: '—',
    avatar: 'Г'
};

// Функция обновления данных профиля
function updateProfileDisplay() {
    document.getElementById('profileUsername').textContent = userData.username;
    document.getElementById('profilePrivilege').textContent = userData.privilege;
    document.getElementById('profileBalance').textContent = userData.balance;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileRegDate').textContent = userData.regDate;
    
    // Обновляем аватар в шапке и в профиле
    const avatarElements = document.querySelectorAll('.avatar');
    avatarElements.forEach(el => el.textContent = userData.avatar);
    document.querySelector('.avatar-large').textContent = userData.avatar;
    
    // Обновляем ник в шапке
    document.querySelector('.username').textContent = userData.username;
}

// Открытие модального окна профиля
profileBtn.addEventListener('click', function() {
    updateProfileDisplay();
    profileModal.style.display = 'block';
});

// Закрытие модального окна профиля
closeProfileModal.addEventListener('click', function() {
    profileModal.style.display = 'none';
    showProfileView(); // Возвращаемся к виду профиля при закрытии
});

// Переход в режим редактирования
editProfileBtn.addEventListener('click', function() {
    showProfileEdit();
    // Заполняем форму текущими данными
    document.getElementById('editUsername').value = userData.username;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editAvatar').value = userData.avatar;
});

// Отмена редактирования
cancelEditBtn.addEventListener('click', function() {
    showProfileView();
});

// Сохранение изменений профиля
editProfileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Обновляем данные пользователя
    userData.username = document.getElementById('editUsername').value.trim();
    userData.email = document.getElementById('editEmail').value.trim();
    userData.avatar = document.getElementById('editAvatar').value.trim().toUpperCase();
    
    // Обновляем отображение
    updateProfileDisplay();
    showProfileView();
    
    alert('Профиль успешно обновлён!');
});

// Пополнение баланса
rechargeBtn.addEventListener('click', function() {
    alert('Функция пополнения баланса будет реализована в ближайшее время!');
});

// Выход из профиля
logoutBtn.addEventListener('click', function() {
    // Сброс данных пользователя
    userData = {
        username: 'Гость',
        privilege: 'Нет',
        balance: '0 руб.',
        email: 'Не указан',
        regDate: '—',
        avatar: 'Г'
    };
    
    // Обновление интерфейса
    updateProfileDisplay();
    profileModal.style.display = 'none';
    alert('Вы вышли из профиля');
});

// Вспомогательные функции для переключения режимов
function showProfileView() {
    profileView.style.display = 'block';
    profileEdit.style.display = 'none';
}

function showProfileEdit() {
    profileView.style.display = 'none';
    profileEdit.style.display = 'block';
}

// Закрытие модальных окон при клике вне их области
window.addEventListener('click', function(event) {
    if (event.target === profileModal) {
        profileModal.style.display = 'none';
        showProfileView();
    }
});

// Элементы DOM для правил сервера
const rulesLink = document.getElementById('rulesLink');
const rulesModal = document.getElementById('rulesModal');
const closeRulesModal = document.getElementById('closeRulesModal');

// Открытие модального окна правил
rulesLink.addEventListener('click', function(e) {
    e.preventDefault();
    rulesModal.style.display = 'block';
});

// Закрытие модального окна правил по крестику
closeRulesModal.addEventListener('click', function() {
    rulesModal.style.display = 'none';
});

// Закрытие модального окна правил при клике вне его области
window.addEventListener('click', function(event) {
    if (event.target === rulesModal) {
        rulesModal.style.display = 'none';
    }
});

// Функция сохранения данных профиля в localStorage
function saveProfileData(data) {
    localStorage.setItem('gladyProfile', JSON.stringify(data));
}

// Функция загрузки данных профиля из localStorage
function loadProfileData() {
    const savedData = localStorage.getItem('gladyProfile');
    return savedData ? JSON.parse(savedData) : null;
}

// Функция обновления отображения профиля
function updateProfileDisplay(profileData) {
    if (!profileData) return;

    document.getElementById('profileUsername').textContent = profileData.username || 'Гость';
    document.getElementById('profileEmail').textContent = profileData.email || 'Не указан';
    document.getElementById('editUsername').value = profileData.username || '';
    document.getElementById('editEmail').value = profileData.email || '';
    document.getElementById('editAvatar').value = profileData.avatar || 'Г';

    // Обновляем кнопку профиля
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
        usernameElement.textContent = profileData.username || 'Гость';
    }

    const avatarElement = document.querySelector('.avatar');
    if (avatarElement) {
        avatarElement.textContent = profileData.avatar || 'Г';
    }
}

// Обработчик отправки формы редактирования профиля
document.getElementById('editProfileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const profileData = {
        username: document.getElementById('editUsername').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        avatar: document.getElementById('editAvatar').value.trim()
    };

    saveProfileData(profileData);
    updateProfileDisplay(profileData);

    // Переключаем обратно на режим просмотра
    document.getElementById('profileView').style.display = 'block';
    document.getElementById('profileEdit').style.display = 'none';
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const savedProfile = loadProfileData();
    updateProfileDisplay(savedProfile);

    // Обработчики для кнопок профиля
    document.getElementById('profileBtn').addEventListener('click', function() {
        document.getElementById('profileModal').style.display = 'block';
    });

    document.getElementById('editProfileBtn').addEventListener('click', function() {
        document.getElementById('profileView').style.display = 'none';
        document.getElementById('profileEdit').style.display = 'block';
    });

    document.getElementById('cancelEditBtn').addEventListener('click', function() {
        document.getElementById('profileView').style.display = 'block';
        document.getElementById('profileEdit').style.display = 'none';
    });

    // Закрытие модальных окон
    document.querySelector('.close').addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

function validateProfileData(data) {
    if (!data.username || data.username.length < 2) {
        alert('Ник должен содержать минимум 2 символа');
        return false;
    }
    if (!data.email || !data.email.includes('@')) {
        alert('Введите корректный email');
        return false;
    }
    if (!data.avatar || data.avatar.length !== 1) {
        alert('Аватар должен быть одним символом');
        return false;
    }
    return true;
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('gladyProfile');
    updateProfileDisplay({
        username: 'Гость',
        email: 'Не указан',
        avatar: 'Г'
    });
    document.getElementById('profileModal').style.display = 'none';
});

