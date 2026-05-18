// @todo: напишите здесь код парсера
function parsePage() {

    // part meta
    const meta = {};
    const htmlElement = document.querySelector('html');
    const lang = htmlElement.getAttribute('lang');
    meta.lang = lang;

    const titleElement = document.querySelector('title');
    const fullTitle = titleElement.textContent;
    const separator = fullTitle.split(' — ');
    const cleanTitle = separator[0];
    meta.title = cleanTitle;

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    const keywordsContent = keywordsMeta ? keywordsMeta.getAttribute('content') : null;
    meta.keywords = keywordsMeta 
    ? keywordsMeta.getAttribute('content').split(',').map(item => item.trim())
    : [];

    const descriptionMeta = document.querySelector('meta[name="description"]');
    meta.description = descriptionMeta ? descriptionMeta.getAttribute('content') : '';

    const ogElements = document.querySelectorAll('meta[property^="og:"]');
    const ogData = {}
    for (const node of ogElements) {
        const fullProperty = node.getAttribute('property');
        const key = fullProperty.replace('og:', '');
        const value = node.getAttribute('content');
        ogData[key] = value;
    }
    meta.og = ogData;

    // part section
    const product = {};
    const sections = document.querySelectorAll('section');
    let productId = null;
    if (sections.length > 0) {
        const firstSection = sections[0];
        productId = firstSection.getAttribute('data-id');
    }
    product.id = productId;

    const mainImageElement = document.querySelector('figure img');
    const mainImageFull = mainImageElement.getAttribute('src');
    const mainImageAlt  = mainImageElement.getAttribute('alt');
    const imagesArray = [];
    imagesArray.push({
        full: mainImageFull,
        thumbnail: mainImageFull,
        alt: mainImageAlt
    });
    const thumbnailImgs = document.querySelectorAll('nav button img');
    for (let i = 1; i < thumbnailImgs.length; i++) {
        const thumbImg = thumbnailImgs[i];
        const full = thumbImg.dataset.src;
        const thumbnail = thumbImg.src;
        const alt = thumbImg.alt;
        imagesArray.push({ full, thumbnail, alt });
    }
    product.images = imagesArray;

    // Like status
    const likeButton = document.querySelector('figure .like')
    const isLiked = likeButton ? likeButton.classList.contains('active') : false;
    product.liked = isLiked;

    // Product Name (h1)
    const productTitleElement = document.querySelector('h1');
    product.title = productTitleElement ? productTitleElement.textContent : '';

    // Arrays of tags, categories, and discounts
    const tagElements = document.querySelectorAll('.tags span');
    const tagsArray = [];
    const categoriesArray = [];
    const discountsArray = [];
    for (let currentTag of tagElements) {
       const tagText = currentTag.textContent;
        if (currentTag.classList.contains('green')) {
        categoriesArray.push(tagText);
        } else if (currentTag.classList.contains('blue')) {
        tagsArray.push(tagText);
        } else if (currentTag.classList.contains('red')) {
        discountsArray.push(tagText);
        }
    }
    product.categories = categoriesArray;
    product.tags = tagsArray;
    product.discounts = discountsArray;

    // Prices and currency
    const priceContainer = document.querySelector('.price')
    const priceText = priceContainer.textContent;
    const currencySymbol = priceText[0];
    const firstPrice = priceContainer ? Number(priceContainer.textContent.replace('₽', '').trim()) : null;
    const priceOldContainer = document.querySelector('.price span')
    const oldPrice = priceOldContainer ? Number(priceOldContainer.textContent.replace('₽', '').trim()) : null;
    let currencyCode = '';
    if (currencySymbol === '₽') {
        currencyCode = 'RUB';
    } else if (currencySymbol === '$') {
      currencyCode = 'USD';
    } else if (currencySymbol === '€') {
      currencyCode = 'EUR';
    } else {
      currencyCode = '';
    }
    product.currency = currencyCode;
    product.currentPrice = firstPrice;
    product.oldPrice = oldPrice;
    let discountPercent = 0;
    if (oldPrice !== null && oldPrice > firstPrice) {
    discountPercent = Math.round((oldPrice - firstPrice) / oldPrice * 100);
    }
    product.discountPercent = discountPercent;

    // Product properties (characteristics)
    const propertiesObject = {};
    const propertyItems = document.querySelectorAll('.properties li');
    for (const currentItem of propertyItems) {
        const spans = currentItem.querySelectorAll('span');
        const keyText = spans[0]?.textContent.trim();
        const valueText = spans[1]?.textContent.trim();
        propertiesObject[keyText] = valueText;
    }
    product.properties = propertiesObject;

    // Full product description
    const descriptionElement = document.querySelector('.description') 
    if (!descriptionElement) {
    product.fullDescription = '';
    } else {
    const clone = descriptionElement.cloneNode(true);
    const allElementsInClone = clone.querySelectorAll('*');
        for (const element of allElementsInClone) {
            const attributes = [...element.attributes];
            for (const attr of attributes) {
                element.removeAttribute(attr.name);
            }
        }
    product.fullDescription = clone.innerHTML;
    }

    // Suggested array
    const suggestedArticles = document.querySelectorAll('.suggested .items article');
    const suggestedArray = [];

    for (const article of suggestedArticles) {
    const imgElement = article.querySelector('img');
    const image = imgElement ? imgElement.getAttribute('src') : '';
    const titleElement = article.querySelector('h3');
    const titleText = titleElement.textContent;
    const descElement = article.querySelector('p');
    const descriptionText = descElement ? descElement.textContent : '';
    const priceElement = article.querySelector('b');
    const priceText = priceElement.textContent;
    const priceValue = Number(priceText.slice(1));
    const suggestedCurrencySymbol = priceText[0]; 
    if (suggestedCurrencySymbol  === '₽') {
        currencyCode = 'RUB';
    } else if (suggestedCurrencySymbol  === '$') {
      currencyCode = 'USD';
    } else if (suggestedCurrencySymbol  === '€') {
      currencyCode = 'EUR';
    } else {
      currencyCode = '';
    }
    suggestedArray.push({
    image: image,
    title: titleText,
    price: priceValue,
    currency: currencyCode,
    description: descriptionText  
    });
    }
    product.suggested = suggestedArray;

    // Array of reviews
    const reviewArticles = document.querySelectorAll('.reviews .items article');
    const reviewsArray = [];

    for (const review of reviewArticles) {
        const ratingSpans = review.querySelectorAll('.rating .filled');
        const ratingCount = ratingSpans.length;

        const titleElement = review.querySelector('h3');
        const titleText = titleElement ? titleElement.textContent : '';

        const descElement = review.querySelector('p');
        const descriptionText = descElement ? descElement.textContent : '';

        const avatarImg = review.querySelector('.author img');
        const avatarSrc = avatarImg ? avatarImg.getAttribute('src') : '';

        const nameSpan = review.querySelector('.author span');
        const authorName = nameSpan ? nameSpan.textContent : '';

        const dateElem = review.querySelector('.author i');
        const dateText = dateElem ? dateElem.textContent : '';

        reviewsArray.push({
            rating: ratingCount,
            title: titleText,
            description: descriptionText,
            author: {
                avatar: avatarSrc,
                name: authorName
            },
            date: dateText
        });
    }

    product.reviews = reviewsArray;

    return {
        meta: meta,
        product: product,
        suggested: suggestedArray,
        reviews: reviewsArray
    };
}

window.parsePage = parsePage;