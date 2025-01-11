import puppeteer from 'puppeteer';
import fs from 'fs';
import OpenAI from "openai";

// Ініціалізація OpenAI
const openai = new OpenAI({
  apiKey: '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'
});

// Функція для парсингу опису продукту
async function fetchProductDescription(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 50000 });

    // Чекаємо елемент із класом .prod-desc
    await page.waitForSelector('.prod-desc', { timeout: 50000 });
    const description = await page.$eval('.prod-desc', el => el.innerText);

    console.log("Опис продукту:", description);
    await browser.close();
    return description;
  } catch (error) {
    console.error(`Помилка при парсингу сторінки: ${error.message}`);
    await browser.close();
    throw error;
  }
}

// Функція для генерації AIDA-тексту
async function generateAIDA(description) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: 'Ти — досвідчений копірайтер більше 10 років в ринку і працюєш в Україні .' },
        { role: 'user', content: `Зроби рекламний пост для соціальних мереж по системі AIDA з цього тексту:\n${description}` }
      ],
      temperature: 0.7
    });

    const aidaText = completion.choices[0].message.content;
    console.log("Згенерований AIDA-текст:", aidaText);
    return aidaText;
  } catch (error) {
    console.error(`Помилка генерації AIDA: ${error.message}`);
    throw error;
  }
}

// Основна функція
async function main(url) {
  try {
    // Крок 1: Отримуємо опис продукту
    const productDescription = await fetchProductDescription(url);

    // Крок 2: Генеруємо AIDA
    const aidaText = await generateAIDA(productDescription);

    // Крок 3: Зберігаємо результат у файл
    const productId = url.split('/').pop(); // Отримуємо ID продукту з URL
    const outFile = `${productId}_AIDA.txt`;
    fs.writeFileSync(outFile, aidaText, 'utf8');
    console.log(`AIDA-текст збережено у файл: ${outFile}`);
  } catch (error) {
    console.error(`Сталася помилка: ${error.message}`);
  }
}

// Отримання URL із командного рядка
const productUrl = process.argv[2];

if (!productUrl) {
  console.error('Використання: node script.js <посилання_на_сайт>');
  process.exit(1);
}

// Запуск основної функції
main(productUrl);