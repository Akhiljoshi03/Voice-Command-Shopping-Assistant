import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShoppingProvider } from './context/ShoppingContext';
import { ToastProvider } from './context/ToastContext';
import { ToastHost } from './components/common/ToastHost';
import { Layout } from './components/common/Layout';
import { Home } from './pages/Home';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { SearchPage } from './pages/SearchPage';
import { SuggestionsPage } from './pages/SuggestionsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <ShoppingProvider>
      <ToastProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/list" element={<ShoppingListPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/suggestions" element={<SuggestionsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
          <ToastHost />
        </BrowserRouter>
      </ToastProvider>
    </ShoppingProvider>
  );
}
