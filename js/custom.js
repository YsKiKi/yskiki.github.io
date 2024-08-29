document.addEventListener('DOMContentLoaded', function () {
  const copyButtons = document.querySelectorAll('.code-block .copy-btn');

  copyButtons.forEach(button => {
    // 初始化按钮文本为“复制”
    button.innerText = '复制';

    button.addEventListener('click', function () {
      const codeBlock = button.closest('.code-block');
      const code = codeBlock.querySelector('pre code').innerText;

      navigator.clipboard.writeText(code).then(() => {
        // 点击后按钮文本显示为“复制成功”
        button.innerText = '复制成功';

        // 添加一次性事件监听器，等待用户的下一次点击后恢复为“复制”
        document.addEventListener('click', function resetButton() {
          button.innerText = '复制';
          document.removeEventListener('click', resetButton);
        }, { once: true });
      });
    });
  });
});
