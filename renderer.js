console.log("renderer.js loaded");
document.getElementById('run-btn').addEventListener('click', () => {
  const url = document.getElementById('url-input').value;
  if (!url) {
    document.getElementById('output').innerText = 'Будь ласка, введіть URL!';
    return;
  }

  // Відправка URL до основного процесу через API
  window.electronAPI.sendToMain('run-scripts', url);

  document.getElementById('output').innerText = 'Скрипти запущені, зачекайте...';

  // Отримання відповіді від основного процесу
  window.electronAPI.receiveFromMain('script-response', (message) => {
    document.getElementById('output').innerText = message;
  });
});