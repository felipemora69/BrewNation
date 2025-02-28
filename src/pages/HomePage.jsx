import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassWater, Hop, Thermometer, Download } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <GlassWater className="h-6 w-6 text-amber-600" />,
      title: "50+ Beer Styles",
      description: "Choose from a wide variety of beer styles, from classic IPAs to unique craft brews."
    },
    {
      icon: <Hop className="h-6 w-6 text-amber-600" />,
      title: "Custom Ingredients",
      description: "Get precise measurements for malts, hops, and yeasts based on your desired quantity."
    },
    {
      icon: <Thermometer className="h-6 w-6 text-amber-600" />,
      title: "Detailed Instructions",
      description: "Follow step-by-step brewing instructions with exact temperatures and timings."
    },
    {
      icon: <Download className="h-6 w-6 text-amber-600" />,
      title: "Downloadable Recipes",
      description: "Save your custom recipe in PDF format for future reference."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create Your Perfect Beer Recipe
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Welcome to the Beer Recipe Generator! Design your own personalized beer recipe by choosing from over 50 styles and customizing the quantity you wish to brew.
        </p>
        <button
          onClick={() => navigate('/create')}
          className="bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          Get Started
        </button>
      </div>

      <div className="mt-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center">
        <img
          src="https://images.unsplash.com/photo-1571767454098-246b94fbcf70?auto=format&fit=crop&q=80&w=1200"
          alt="Brewing Process"
          className="rounded-lg shadow-xl mx-auto"
        />
        <p className="mt-4 text-sm text-gray-500">
          Create professional-grade beer recipes with our easy-to-use tool
        </p>
      </div>
    </div>
  );
}

export default HomePage;