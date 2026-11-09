// --- ЧАСТЬ 1: ВАЛИДАЦИЯ ФОРМ ---

/**
 * Показывает сообщение об ошибке под полем.
 * @param {string} fieldId - ID поля ввода
 * @param {string} message - Текст ошибки
 */
/**
 * Показывает сообщение об ошибке под полем.
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    // Ищем span с ID вида "error-" + fieldId
    // Например, для expense-category будет искать error-expense-category
    const errorSpan = document.getElementById('error-' + fieldId); 
    
    if (field) {
        field.classList.add('invalid');
    }
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block'; // Принудительно показываем
    }
}

/**
 * Очищает сообщение об ошибке.
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById('error-' + fieldId);

    if (field) {
        field.classList.remove('invalid');
    }
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none'; // Прячем
    }
}

/**
 * Проверяет форму добавления расхода.
 * @returns {boolean} true, если все данные корректны
 */
function validateExpenseForm() {
    let isValid = true;

    // Дата
    const dateInput = document.getElementById('expense-date');
    const today = new Date().toISOString().split('T')[0];
    
    if (!dateInput.value) {
        showError('expense-date', 'Укажите дату расхода');
        isValid = false;
    } else if (dateInput.value > today) {
        showError('expense-date', 'Дата не может быть позже сегодняшнего дня');
        isValid = false;
    } else {
        clearError('expense-date');
    }

    // Сумма
    const amountInput = document.getElementById('expense-amount');
    const amountValue = parseFloat(amountInput.value);
    
    if (!amountInput.value || isNaN(amountValue)) {
        showError('expense-amount', 'Введите корректную сумму');
        isValid = false;
    } else if (amountValue <= 0) {
        showError('expense-amount', 'Сумма должна быть больше нуля');
        isValid = false;
    } else {
        clearError('expense-amount');
    }

    // Категория
    const categorySelect = document.getElementById('expense-category');
    
    if (!categorySelect.value) {
        showError('expense-category', 'Выберите категорию расхода');
        isValid = false;
    } else {
        clearError('expense-category');
    }

    return isValid;
}

/**
 * Проверяет форму обратной связи.
 * @returns {boolean} true, если все данные корректны
 */
function validateFeedbackForm() {
    let isValid = true;

    // Имя
    const nameInput = document.getElementById('feedback-name');
    
    if (!nameInput.value.trim()) {
        showError('feedback-name', 'Введите ваше имя');
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        showError('feedback-name', 'Имя должно содержать минимум 2 символа');
        isValid = false;
    } else {
        clearError('feedback-name');
    }

    // Email
    const emailInput = document.getElementById('feedback-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailInput.value.trim()) {
        showError('feedback-email', 'Введите адрес электронной почты');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showError('feedback-email', 'Введите корректный формат email');
        isValid = false;
    } else {
        clearError('feedback-email');
    }

    // Сообщение
    const messageInput = document.getElementById('feedback-message');
    
    if (!messageInput.value.trim()) {
        showError('feedback-message', 'Введите текст сообщения');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showError('feedback-message', 'Сообщение должно содержать минимум 10 символов');
        isValid = false;
    } else {
        clearError('feedback-message');
    }

    // Согласие
    const consentCheckbox = document.getElementById('feedback-consent');
    
    if (!consentCheckbox.checked) {
        showError('feedback-consent', 'Необходимо согласие на обработку данных');
        isValid = false;
    } else {
        clearError('feedback-consent');
    }

    return isValid;
}

// Привязка обработчиков к формам
document.addEventListener('DOMContentLoaded', () => {
    // Форма добавления расхода
    const expenseForm = document.querySelector('form[action="#"][method="post"]');
    if (expenseForm && document.getElementById('expense-date')) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault(); // останавливаем отправку
            
            if (validateExpenseForm()) {
                alert('Форма заполнена корректно! (Данные пока не сохраняются — сервер появится в ПР3)');
                expenseForm.reset();
            }
        });
    }

    // Форма обратной связи
    const feedbackForm = document.querySelector('form[action="#"][method="post"]');
    if (feedbackForm && document.getElementById('feedback-name')) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateFeedbackForm()) {
                alert('Обращение отправлено! (Данные пока не сохраняются — сервер появится в ПР3)');
                feedbackForm.reset();
            }
        });
    }
});

/**
 * Загружает курсы валют ЦБ РФ и отображает их на странице.
 * Использует endpoint cbr-xml-daily.ru (JSONP/JSON compatible with CORS)
 */
async function loadExchangeRates() {
    const container = document.getElementById('exchange-rates-widget');
    
    // Защита: если блока нет на этой странице, выходим тихо
    if (!container) return;

    // Показываем индикатор загрузки
    container.innerHTML = '<p class="loading-state">⏳ Загрузка курсов валют...</p>';

    try {
        // Делаем асинхронный запрос
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        
        // Проверяем статус HTTP
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        // Парсим JSON
        const data = await response.json();
        
        // Получаем данные по Доллару и Евро
        const usd = data.Valute.USD.Value.toFixed(2);
        const eur = data.Valute.EUR.Value.toFixed(2);
        const prevUsd = data.Valute.USD.Previous.toFixed(2);
        const prevEur = data.Valute.EUR.Previous.toFixed(2);

        // Рассчитываем изменение
        const usdChange = ((usd - prevUsd) / prevUsd * 100).toFixed(2);
        const eurChange = ((eur - prevEur) / prevEur * 100).toFixed(2);

        // Формируем HTML вывода
        container.innerHTML = `
            <div class="rates-grid">
                <div class="rate-card">
                    <h4>USD</h4>
                    <p class="rate-value">${usd} ₽</p>
                    <span class="${usdChange >= 0 ? 'trend-up' : 'trend-down'}">
                        ${usdChange >= 0 ? '+' : ''}${usdChange}%
                    </span>
                </div>
                <div class="rate-card">
                    <h4>EUR</h4>
                    <p class="rate-value">${eur} ₽</p>
                    <span class="${eurChange >= 0 ? 'trend-up' : 'trend-down'}">
                        ${eurChange >= 0 ? '+' : ''}${eurChange}%
                    </span>
                </div>
            </div>
            <small class="update-time">Обновлено: ${new Date(data.Date).toLocaleString('ru-RU')}</small>
        `;

    } catch (error) {
        console.error('Failed to load rates:', error);
        // Обработка ошибки сети (важное требование ПР2)
        container.innerHTML = `
            <div class="error-message-network">
                ⚠️ Не удалось загрузить курсы валют.<br>
                Проверьте интернет-соединение или попробуйте позже.
            </div>
        `;
    }
}

// Вызываем функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    loadExchangeRates();
});