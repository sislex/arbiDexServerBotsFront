import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './app/App.tsx';
import { store } from './app/store/store.ts';
import { initThemeFromStorage } from './app/services/theme.ts';
import './styles/index.css';

initThemeFromStorage();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
  