import fs from 'fs';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: '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'
});

async function generateAIDA(inputFile) {
  // Зчитуємо вихідний текст із вказаного файлу
  const originalText = fs.readFileSync(inputFile, 'utf8');

  // Викликаємо OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4", // Використовуйте доступну модель
    messages: [
      { role: 'system', content: 'Ти — досвідчений копірайтер більше 10 років в ринку і працюєш в Україні.' },
      { role: 'user', content: `Зроби рекламний пост для соціальних мереж по системі AIDA без слів (Attention)(Interest)(Desire)(Action) в самому тексті кінцевий результат повинен бути готовим до використання в соціальних мережах instagram та facebook з цього тексту:\n${originalText}` }
    ],
    temperature: 0.7
  });

  // Отримуємо AIDA-текст із відповіді
  const aidaText = completion.choices[0].message.content;

  // Зберігаємо результат у новий файл
  const outFile = inputFile.replace('.txt', '_AIDA.txt');
  fs.writeFileSync(outFile, aidaText, 'utf8');
  console.log(`AIDA-текст збережено в: ${outFile}`);
}

// Якщо запускається напряму
if (process.argv[1].endsWith('gptAida.mjs')) {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('Використання: node gptAida.mjs <текстовий_файл.txt>');
    process.exit(1);
  }
  await generateAIDA(inputFile);
}