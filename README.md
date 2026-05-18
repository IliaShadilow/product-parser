# sp6-1_parser_starter

Для запуска откройте `index.html` и выполняйте работе в файле parser.js.

По готовности или сразу раскомментируйте вызов makeTests();

# Парсер страницы товара — краткая документация

## Универсальный алгоритм парсинга

//1. Найти контейнер
const el = document.querySelector('.selector');

//2. Проверить существование
const data = el ? el.textContent : '';

//3. Извлечь данные
const text = el.textContent;
const attr = el.getAttribute('data-id');
const src = img.src;

//4. Преобразовать
const num = Number('50');
const arr = 'a,b,c'.split(',');
const clean = ' text '.trim();
const replaced = '₽50'.replace('₽', '');

## Переиспользуемые функции (вынести в утилиты)

//Определение валюты по первому символу
function getCurrencyCode(priceText) {
    if (!priceText) return '';
    const symbol = priceText[0];
    if (symbol === '₽') return 'RUB';
    if (symbol === '$') return 'USD';
    if (symbol === '€') return 'EUR';
    return '';
}

//Извлечение числа из цены
function getPriceValue(priceText) {
    if (!priceText) return 0;
    return Number(priceText.slice(1));
}

//Очистка HTML от атрибутов
function getCleanHTML(element) {
    if (!element) return '';
    const clone = element.cloneNode(true);
    const all = clone.querySelectorAll('*');
    for (const el of all) {
        const attrs = [...el.attributes];
        for (const attr of attrs) el.removeAttribute(attr.name);
    }
    return clone.innerHTML;
}

//Безопасное получение текста
function getText(selector, ctx = document) {
    const el = ctx.querySelector(selector);
    return el ? el.textContent.trim() : '';
}

## Адаптация под другую страницу

1. Открыть инспектор (F12)

2. Найти новые селекторы для нужных данных

3. Заменить селекторы в коде

(если не отобразится посмотреть как сдлеать таблицу в readme)
Что ищем	Селектор на этом сайте	Может быть на другом
Название	h1	.product-title
Цена	.price	[data-price]
Изображение	figure img	.gallery img
Свойства	.properties li span	.specs tr

## Что улучшить

* Вынести повторяющийся код в функции (валюта, цена, очистка)

* Добавить try/catch для критичных блоков

* Сделать конфиг с селекторами

* Добавить валидацию данных

## Чек-лист для парсинга любой страницы

* Открыть инспектор → найти контейнер с данными

* Написать querySelector / querySelectorAll

* Добавить проверку if (element) или тернарник

* Извлечь данные: .textContent, .getAttribute(), .src

* Преобразовать: Number(), .trim(), .split(), .replace()

* Сохранить в объект

* Повторить для всех блоков

* Вынести повторяющийся код в утилиты

* Добавить try/catch для критичных блоков

* Протестировать на разных страницах (если есть)

