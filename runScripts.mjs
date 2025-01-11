import { exec } from 'child_process';

// Функція для запуску команд
function runScript(script, args = []) {
  return new Promise((resolve, reject) => {
    const command = `node ${script} ${args.join(' ')}`;
    console.log(`Запуск: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Помилка виконання ${script}:`, error.message);
        reject(error);
      } else {
        console.log(`Результат виконання ${script}:\n${stdout}`);
        if (stderr) {
          console.error(`Попередження під час виконання ${script}:\n${stderr}`);
        }
        resolve();
      }
    });
  });
}

// Основна функція
async function main() {
  // Отримуємо URL продукту з аргументів командного рядка
  const productUrl = process.argv[2];

  if (!productUrl) {
    console.error('Будь ласка, надайте посилання на продукт. Наприклад:');
    console.error('node runScripts.mjs https://grandezza.wayforpay.shop/prod/481250');
    process.exit(1);
  }

  try {
    // Запускаємо перший скрипт для отримання опису
    await runScript('scrape.js', [productUrl]);

    // Отримуємо ID продукту з URL
    const productId = productUrl.split('/').pop();

    // Запускаємо другий скрипт для генерації AIDA
    await runScript('gptAida.mjs', [`${productId}.txt`]);

    console.log('Обидва скрипти виконано успішно!');
  } catch (error) {
    console.error('Помилка під час виконання скриптів:', error.message);
  }
}

// Запуск
main();