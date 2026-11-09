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