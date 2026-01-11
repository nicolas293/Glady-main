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

    // Показываем индикатор загрузки
    showLoading();

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
