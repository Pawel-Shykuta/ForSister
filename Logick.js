const seriesLinkInput = document.getElementById('series-link');
const seriesNameInput = document.getElementById('series-name');
const seriesStatusInput = document.getElementById('series-status');
const addButton = document.getElementById('add-series');
const seriesList = document.getElementById('series-list');
const statusFilter = document.getElementById('status-filter');

// Обработчик для кнопки "Добавить"
addButton.addEventListener('click', addSeries);

// Функция для добавления сериала в список
function addSeries() {
  const link = seriesLinkInput.value.trim();
  const name = seriesNameInput.value.trim();
  const status = seriesStatusInput.value || 'not-started'; // Если статус не выбран, устанавливаем "not-started"
  
  if (link === '' || name === '') return;

  const series = {
    link,
    name,
    status,
  };

  saveSeries(series);
  renderSeries(series);

  // Очищаем поля ввода
  seriesLinkInput.value = '';
  seriesNameInput.value = '';
  seriesStatusInput.value = 'not-started';
}

// Функция для рендеринга сериалов на странице
function renderSeries(series) {
  const li = document.createElement('li');
  li.className = series.status;
  li.innerHTML = `
    <div class="LinksCon"> 
        <a class="liLinks" href="${series.link}" target="_blank">${series.name}</a>
        <div class="actions">
            <button class="view">${getViewButtonText(series.status)}</button>
            <button class="delete">Удалить</button>
        </div>
    </div>
  `;
  
  li.querySelector('.view').addEventListener('click', () => toggleStatus(series.link, li));
  li.querySelector('.delete').addEventListener('click', () => deleteSeries(series.link, li));

  seriesList.appendChild(li);
}

// Функция для получения текста кнопки в зависимости от статуса
function getViewButtonText(status) {
  switch (status) {
    case 'not-started':
      return 'Начать';
    case 'started':
      return 'Завершить';
    case 'viewed':
      return 'Снято';
  }
}

// Функция для изменения статуса сериала
function toggleStatus(link, li) {
  const series = getSeries();
  const index = series.findIndex(s => s.link === link);

  if (index !== -1) {
    const currentStatus = series[index].status;
    let newStatus;

    if (currentStatus === 'not-started') {
      newStatus = 'started';
    } else if (currentStatus === 'started') {
      newStatus = 'viewed';
    } else {
      newStatus = 'not-started';
    }

    series[index].status = newStatus;
    saveAllSeries(series);

    li.className = newStatus;
    li.querySelector('.view').textContent = getViewButtonText(newStatus);
  }
}

// Функция для удаления сериала
function deleteSeries(link, li) {
  let series = getSeries();
  series = series.filter(s => s.link !== link);
  saveAllSeries(series);
  seriesList.removeChild(li);
}

// Функция для сохранения одного сериала в localStorage
function saveSeries(series) {
  const allSeries = getSeries();
  allSeries.push(series);
  saveAllSeries(allSeries);
}

// Функция для сохранения всех сериалов в localStorage
function saveAllSeries(series) {
  localStorage.setItem('series', JSON.stringify(series));
}

// Функция для получения сериалов из localStorage, возвращает пустой массив, если данных нет
function getSeries() {
  const series = localStorage.getItem('series');
  return series ? JSON.parse(series) : [];
}

// Функция для загрузки сериалов из localStorage
function loadSeries() {
  const allSeries = getSeries();
  allSeries.forEach(renderSeries);
}

// Функция для фильтрации сериалов по статусу
function filterSeries() {
  const status = statusFilter.value;
  const allSeries = getSeries();
  seriesList.innerHTML = '';

  allSeries
    .filter(s => status === 'all' || s.status === status)
    .forEach(renderSeries);
}

// Добавляем обработчик фильтрации
statusFilter.addEventListener('change', filterSeries);

// Загружаем сериалы при перезагрузке страницы
loadSeries();
