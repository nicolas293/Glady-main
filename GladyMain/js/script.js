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
