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