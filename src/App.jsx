import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeCreator from './pages/RecipeCreator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                {/* Logo */}
                <Link to="/"> {/* Link component for navigation */}
                  <img src="/images/mug.png" alt="Logo" className="h-8 w-8 cursor-pointer" />
                </Link>
                <Link to="/" className="ml-2 text-xl font-semibold text-gray-900">
                  BrewNation
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<RecipeCreator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;