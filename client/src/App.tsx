// App.tsx
import './App.css';

import { Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage.tsx';
import CategoryPage from './components/CategoriePage.tsx';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:name" element={<CategoryPage />} />
    </Routes>
    </>
  );
}

export default App;
