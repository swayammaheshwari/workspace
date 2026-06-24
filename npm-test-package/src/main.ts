import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (app) {
  app.innerHTML = `
    <h1>Hello Vite!</h1>
    <a href="https://vite.dev/guide/features.html" target="_blank">Documentation</a>
  `
}

