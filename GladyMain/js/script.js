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

// Обработчик формы оплаты
paymentForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const packageName = selectedPackage.textContent;

    // Валидация данных
    if (!validateForm(username, email, paymentMethod)) {
        return;
    }

    try {
        // Имитация отправки данных на сервер
        const response = await simulatePayment(username, email, packageName, paymentMethod);

        if (response.success) {
            // Успешная оплата
            showSuccessMessage(response.message);
            setTimeout(() => {
                closeModal();
                resetForm();
            }, 3000);
        } else {
            // Ошибка оплаты
            showErrorMessage(response.message);
        }
    } catch (error) {
        showErrorMessage('Произошла ошибка при обработке платежа. Попробуйте ещё раз.');
    } finally {
        hideLoading();
    }
});

// Функция валидации формы
function validateForm(username, email, paymentMethod) {
    let isValid = true;
    let errorMessage = '';

    if (username.trim().length < 3) {
        errorMessage = 'Ник должен содержать минимум 3 символа.';
        isValid = false;
    } else if (!isValidEmail(email)) {
        errorMessage = 'Введите корректный email-адрес.';
        isValid = false;
    } else if (!paymentMethod) {
        errorMessage = 'Выберите способ оплаты.';
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

// Данные пользователя
let userData = {
    username: 'Гость',
    privilege: 'Нет',
    balance: '0 руб.',
    email: 'Не указан',
    regDate: getCurrentDate(), // Новая строка
    avatar: 'Г'
};

// Функция получения текущей даты в формате ДД.ММ.ГГГГ
function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяц с 0, поэтому +1
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}


// Загружаем профиль из localStorage при старте
loadProfileFromStorage();

// Загружаем профиль из localStorage при старте и обновляем интерфейс
loadProfileFromStorage();
updateProfileDisplay();


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
    
    // Обновляем только редактируемые поля
    userData.username = document.getElementById('editUsername').value.trim();
    userData.email = document.getElementById('editEmail').value.trim();
    userData.avatar = document.getElementById('editAvatar').value.trim().toUpperCase();
    // regDate не меняем — он фиксирован
    
    saveProfileToStorage();
    updateProfileDisplay();
    showProfileView();
    alert('Профиль успешно обновлён!');
});

document.getElementById('profileRegDate').textContent = userData.regDate;



// Выход из профиля
logoutBtn.addEventListener('click', function() {
    userData = {
        username: 'Гость',
        privilege: 'Нет',
        balance: '0 руб.',
        email: 'Не указан',
        regDate: getCurrentDate(), // Устанавливаем текущую дату для «гостя»
        avatar: 'Г'
    };
    saveProfileToStorage();
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


// Сохранение данных профиля в localStorage
function saveProfileToStorage() {
    localStorage.setItem('userProfile', JSON.stringify(userData));
}

// Загрузка данных профиля из localStorage
function loadProfileFromStorage() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        userData = JSON.parse(savedProfile);
    }
}

function loadProfileFromStorage() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const loadedData = JSON.parse(savedProfile);
        // Сохраняем загруженную дату регистрации, если она есть
        userData.regDate = loadedData.regDate || getCurrentDate();
        // Остальные поля
        userData.username = loadedData.username || 'Гость';
        userData.privilege = loadedData.privilege || 'Нет';
        userData.balance = loadedData.balance || '0 руб.';
        userData.email = loadedData.email || 'Не указан';
        userData.avatar = loadedData.avatar || 'Г';
    }
}

function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}



// Элементы DOM для пополнения баланса (объявляем, но не используем до загрузки DOM)
let rechargeModal, rechargeForm, rechargeAmountInput, totalAmountDisplay, currentBalanceDisplay, rechargeBtn1;

// Функция открытия модального окна пополнения
function openRechargeModal() {
    // Обновляем отображение текущего баланса
    if (currentBalanceDisplay) {
        currentBalanceDisplay.textContent = userData.balance;
    }

    // Сбрасываем форму
    if (rechargeForm) {
        rechargeForm.reset();
    }
    if (totalAmountDisplay) {
        totalAmountDisplay.textContent = '0';
    }

    // Показываем модальное окно
    if (rechargeModal) {
        rechargeModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Функция закрытия модального окна пополнения
function closeRechargeModal() {
    if (rechargeModal) {
        rechargeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Привязка всех обработчиков после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Переинициализируем элементы после загрузки DOM
    rechargeModal = document.getElementById('rechargeModal');
    rechargeForm = document.getElementById('rechargeForm');
    rechargeAmountInput = document.getElementById('rechargeAmount');
    totalAmountDisplay = document.getElementById('totalAmount');
    currentBalanceDisplay = document.getElementById('currentBalance');
    rechargeBtn1 = document.getElementById('rechargeBtn1');

    // Проверка существования всех элементов
    const elements = [
        { el: rechargeBtn, name: 'Кнопка пополнения' },
        { el: rechargeModal, name: 'Модальное окно' },
        { el: rechargeForm, name: 'Форма пополнения' },
        { el: rechargeAmountInput, name: 'Поле суммы' },
        { el: totalAmountDisplay, name: 'Отображение итоговой суммы' },
        { el: currentBalanceDisplay, name: 'Отображение текущего баланса' }
    ];

    elements.forEach(({ el, name }) => {
        if (!el) {
            console.error(`❌ ${name} не найдена в DOM! Проверьте HTML.`);
        }
    });

    // 1. Привязка кнопки пополнения
    if (rechargeBtn1) {
        rechargeBtn1.addEventListener('click', openRechargeModal);
        console.log('✅ Кнопка пополнения привязана успешно');
    }

    // 2. Обновление суммы при вводе (только если элементы существуют)
    if (rechargeAmountInput && totalAmountDisplay) {
        rechargeAmountInput.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            totalAmountDisplay.textContent = amount.toFixed(2);
        });
    }

    // 3. Обработчик формы пополнения
    if (rechargeForm) {
        rechargeForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const amount = parseFloat(rechargeAmountInput.value);
            const selectedPaymentLink = document.querySelector('.payment-link.selected');

            if (!amount || amount < 10) {
                showErrorMessage('Минимальная сумма пополнения — 10 руб.');
                return;
            }

            if (!selectedPaymentLink) {
                showErrorMessage('Выберите способ оплаты.');
                return;
            }

            const paymentMethod = selectedPaymentLink.getAttribute('data-method');

            try {
                // Имитация пополнения баланса
                const result = await simulateRecharge(amount, paymentMethod);

                if (result.success) {
                    // Обновляем баланс пользователя
            userData.balance = result.newBalance;

            // Сохраняем в localStorage
            saveProfileToStorage();

            // Обновляем отображение
            updateProfileDisplay();

            showSuccessMessage(`Баланс пополнен на ${amount} руб.! Новый баланс: ${result.newBalance}`);
            setTimeout(closeRechargeModal, 2000);
        } else {
            showErrorMessage(result.message);
        }
    } catch (error) {
        showErrorMessage('Произошла ошибка при пополнении баланса. Попробуйте ещё раз.');
    } finally {
        hideLoading();
    }
});
}

// 4. Закрытие модального окна при клике на крестик
const closeBtn = document.querySelector('#rechargeModal .close');
if (closeBtn) {
    closeBtn.addEventListener('click', closeRechargeModal);
}

// 5. Закрытие при клике вне окна
window.addEventListener('click', function(e) {
    if (rechargeModal && e.target === rechargeModal) {
        closeRechargeModal();
    }
});

// 6. Закрытие по клавише Esc
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && rechargeModal && rechargeModal.style.display === 'block') {
        closeRechargeModal();
    }
});
});

// Имитация пополнения баланса (оставляем без изменений)
async function simulateRecharge(amount, paymentMethod) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // В 90 % случаев имитируем успех
            const success = Math.random() > 0.1;

            if (success) {
                // Преобразуем баланс в число, добавляем сумму, возвращаем строку с рублями
                const currentBalanceNum = parseFloat(userData.balance.replace(' руб.', '')) || 0;
                const newBalanceNum = currentBalanceNum + amount;

                resolve({
                    success: true,
                    newBalance: `${newBalanceNum.toFixed(2)} руб.`,
            message: `Баланс успешно пополнен на ${amount} руб.`
        });
            } else {
                resolve({
                    success: false,
            message: 'Ошибка при пополнении. Проверьте данные и попробуйте снова.'
        });
            }
        }, 1500); // Имитация задержки сети
    });
}


function openRechargeModal() {
    // Обновляем отображение текущего баланса
    currentBalanceDisplay.textContent = userData.balance;

    // Сбрасываем форму и сумму к оплате
    rechargeForm.reset();
    totalAmountDisplay.textContent = '0';

    // Показываем модальное окно
    rechargeModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Убираем выделение с ранее выбранного способа оплаты
    document.querySelectorAll('.payment-link').forEach(link => {
        link.classList.remove('selected');
    });
}

function closeRechargeModal() {
    rechargeModal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Сбрасываем форму при закрытии
    rechargeForm.reset();
    totalAmountDisplay.textContent = '0';

    // Убираем выделение со всех способов оплаты
    document.querySelectorAll('.payment-link').forEach(link => {
        link.classList.remove('selected');
    });
}


// Обработчик выбора способа оплаты в окне пополнения
const paymentLinksInRecharge = document.querySelectorAll('#rechargeModal .payment-link');

paymentLinksInRecharge.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Сбрасываем выбор у всех ссылок
        paymentLinksInRecharge.forEach(l => l.classList.remove('selected'));

        // Выделяем выбранную
        this.classList.add('selected');

        console.log('Выбран способ оплаты:', this.getAttribute('data-method'));
    });
});
