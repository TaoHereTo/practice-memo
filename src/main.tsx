import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyFontStyles } from './lib/utils'

// 全局字体应用函数
function applyGlobalFonts() {
  // 应用字体到所有文本元素
  const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, input, textarea');
  textElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      applyFontStyles(element);
    }
  });
}

// 页面加载完成后应用字体
document.addEventListener('DOMContentLoaded', applyGlobalFonts);

// 监听动态内容变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        applyFontStyles(node);
        // 递归处理子元素
        node.querySelectorAll('*').forEach((child) => {
          if (child instanceof HTMLElement) {
            applyFontStyles(child);
          }
        });
      }
    });
  });
});

// 开始观察DOM变化
observer.observe(document.body, {
  childList: true,
  subtree: true
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
