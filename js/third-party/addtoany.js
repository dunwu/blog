/* global NexT */

document.addEventListener('page:loaded', async () => {
  await NexT.utils.getScript('https://static.addtoany.com/menu/page.js', { condition: window.a2a });
  window.a2a.init();
});
