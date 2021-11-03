const parser = new DOMParser();

const urlForm = document.querySelector('.urls-form');
const urlLink = document.querySelector('.urls-link');
const urlSubmit = document.querySelector('.urls-submit');
const urlShowBTN = document.querySelector('.urls-show');
const urls = document.querySelector('.urls-list');
const urlError = document.querySelector('.urls-error');
const urlSucc = document.querySelector('.urls-succ');

// Use of Constraint validation API to check if the input is a URL
urlLink.addEventListener('input', () => {
  urlSubmit.disabled = (urlLink.value === '' || !urlLink.validity.valid);
});

urlForm.addEventListener('submit', e => {
  e.preventDefault();
  const link = urlLink.value;

  fetch(link)
    .then(res => res.text())
    .then(parseLink)
    .then(getData)
    .then(data => saveData(link, data))
    .then(showData)
    .then(successMessage)
    .then(clearSearch)
    .catch(errorMessage);
});

const parseLink = text => parser.parseFromString(text, 'text/html');

// The price in amazon goes by three different ids depending if there is a sale or not
const getData = html => {
  let name = html.querySelector('#productTitle');
  let price = html.querySelector('#priceblock_ourprice');
  if (!price) price = html.querySelector('#priceblock_saleprice') || html.querySelector('#priceblock_dealprice');
  if (!name || !price) return Promise.reject('Could not get the price');
  name = name.innerHTML.trim();
  price = price.innerHTML.replace(',', '');
  const currency = price.substr(0, 1);
  price = parseInt(price.substr(1)) + (parseInt(price.substr(-2)) * 0.01);
  return {
    name: name,
    currency: currency,
    price: price,
    lastPrice: price
  }
}

// Code 22 resembles QuotaExceededErr in Chrome
const saveData = (link, data) => {
  try {
    localStorage.setItem(link, JSON.stringify(data));
  } catch (e) {
    if (e.code === 22) Promise.reject('Not Enough Space');
    else Promise.reject('Unexpected Error');
  }
}

const successMessage = () => {
  urlSucc.innerHTML = 'Successfully Added The Link';
  setTimeout(() => urlSucc.innerHTML = '', 3000);
}

const errorMessage = err => {
  urlError.innerHTML = err;
  setTimeout(() => urlError.innerHTML = '', 3000);
}

const showData = () => {
  let tableContent = `<tr><th>Action</th><th>Name</th><th>Original Price</th><th>% Change</th></tr>`;
  let isLinks = false;
  Object.keys(localStorage).map(link => {
    isLinks = true;
    const { name, currency, price, lastPrice } = JSON.parse(localStorage.getItem(link));
    const percentage = (((lastPrice - price) / price) * 100).toFixed(2);
    tableContent += `
    <tr>
      <td><button class="urls-btn" name="${link}" onClick="removeLink(this)">&#10060;</button> <button class="urls-btn" 
      name="${link}" onClick="goToLink(this)">&#128279;</button></td>
      <td>${name.length > 20 ? name.substr(0, 20) + "..." : name}</td>
      <td>${currency} ${price}</td>
      <td class="${percentage <= 0 ? "green" : "red"}">${percentage <= 0 ? "" : "+"}${percentage}</td>
    </tr>`
  });
  if (!isLinks) tableContent += `<tr><td colspan="4">No Data Present</td></tr>`;
  urls.innerHTML = tableContent;
}

// Once the document have loaded, show the data since the default is no data present.
document.addEventListener('DOMContentLoaded', showData());

const clearSearch = () => {
  urlLink.value = '';
}

const removeLink = btn => {
  localStorage.removeItem(btn.name);
  showData();
}

const goToLink = btn => {
  window.open(btn.name);
}

// Check the prices every 10 minutes
setInterval(() => {
  console.log(localStorage.length);
  if (localStorage.length === 0) return;
  Object.keys(localStorage).map(link => {
    console.log(link);
    fetch(link)
      .then(res => res.text())
      .then(parseLink)
      .then(html => getPriceAndNotfiy(html, link))
      .catch((err) => { console.log(err); errorMessage(err) });
  });
  showData();
}, 600000);

const getPriceAndNotfiy = (html, link) => {
  const data = JSON.parse(localStorage.getItem(link));
  let price = html.querySelector('#priceblock_ourprice');
  if (!price) price = html.querySelector('#priceblock_saleprice');
  if (!price) return Promise.reject('Could not get the price');
  price = price.innerHTML.replace(',', '');
  price = parseInt(price.substr(1)) + (parseInt(price.substr(-2)) * 0.01);
  if (price < data.lastPrice && price < data.price) notifyUser(data.name, price);
  data.lastPrice = price;
  localStorage.setItem(link, JSON.stringify(data));
}

const notifyUser = (name, newPrice) => {
  new Notification('Decrease in Price', {body: `The price of ${name.length > 20 ? name.substr(0, 20) + "..." : name} decreased to ${newPrice}` });
}

urlShowBTN.addEventListener('click', () => {
  if (urls.hasAttribute('hidden')) {
    urls.removeAttribute('hidden');
    urlShowBTN.innerHTML = 'Hide Trackers';
  } else {
    urls.setAttribute('hidden', true);
    urlShowBTN.innerHTML = 'Show Trackers';
  }
});