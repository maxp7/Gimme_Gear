// App.tsx
import './App.css';

import { Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage.tsx';
import CategoryPage from './components/CategoriePage.tsx';
import DBUI from './components/DBUI.tsx';
import ProductPage from './components/ProductPage.tsx';
import AdminPanel from './components/AdminPanel/AdminPanel.tsx';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:deviceName" element={<ProductPage />} />
      <Route path="/:name" element={<CategoryPage />} />
      <Route path="/dbui" element={<DBUI />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
    </>
  );
}

export default App;
