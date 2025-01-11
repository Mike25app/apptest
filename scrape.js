// scrape.js
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Перевіряємо, чи передано URL як аргумент
  const url = process.argv[2];
  if (!url) {
    console.log("Будь ласка, передайте URL. Напр.: node scrape.js https://example.com/prod/123");
    process.exit(1);
  }

  // Виводимо для відлагодження
  console.log("Отримано URL:", url);

  // Розбиваємо за слешем і беремо останній елемент
  // Напр. "https://grandezza.wayforpay.shop/prod/371888" -> "371888"
  let parts = url.split('/').filter(Boolean); 
  // filter(Boolean) відсікає можливі порожні елементи (якщо є зайвий слеш)
  let lastPart = parts.pop(); 

  console.log("Останній фрагмент:", lastPart);

  // Якщо все ще порожньо — можливо, URL має трейлінг-слеш. Спробуйте додатково parts.pop() або використовуйте new URL:
  // let lastPart = new URL(url).pathname.split('/').filter(Boolean).pop();

  const fileName = `${lastPart}.txt`;
  console.log("Буде створено файл:", fileName);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 50000
  });

  // Чекаємо .prod-desc
  await page.waitForSelector('.prod-desc', { timeout: 50000 });
  const textContent = await page.$eval('.prod-desc', el => el.innerText);

  fs.writeFileSync(fileName, textContent, 'utf8');
  console.log(`Файл "${fileName}" успішно створено!`);

  await browser.close();
})();