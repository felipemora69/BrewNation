import React, { useState, useEffect } from 'react';
import { Beer, Scale, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

function RecipeCreator() {
  const [beerName, setBeerName] = useState('');
  const [quantity, setQuantity] = useState(20);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [beers, setBeers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const beerStyles = beers.map(beer => beer.name).sort();//Get the name of the beers to identifying

  useEffect(() => {
    // Fetch BeerRecipes.json from the public folder
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/BeerRecipes.json");
        if (!response.ok) {
          throw new Error('Error fetching beers');
        }
        const data = await response.json();
        setBeers(data.beers);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    setRecipe(null);
  }, [beerName]);

  const generateRecipe = () => {
    setLoading(true);

    setTimeout(() => {
      // Find the selected beer from the 'beers' array
      const selectedBeer = beers.find(beer => beer.name === beerName);
      if (selectedBeer) {
        setRecipe({
          ...selectedBeer,
          ingredients: {
            malts: selectedBeer.ingredients.malts.map(malt => ({
              ...malt,
              amount: (malt.amount_per_liter * quantity).toFixed(2)
            })),
            hops: selectedBeer.ingredients.hops.map(hop => ({
              ...hop,
              amount: (hop.amount_per_liter * quantity).toFixed(2)
            })),
            yeast: selectedBeer.ingredients.yeast || 'Not specified',
            spices: selectedBeer.ingredients.spices ? selectedBeer.ingredients.spices.map(spice => ({
              ...spice,
              amount: (spice.amount_per_liter * quantity).toFixed(2),
            })) : [],
            water: (selectedBeer.ingredients.water_ratio * quantity).toFixed(2)
          }
        });
      }
      setLoading(false);
    }, 1500);
  };

  // Download the PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = `${recipe.name} Recipe`;
    const ingredients = `
      Malts:
      ${recipe.ingredients.malts.map(malt => `${malt.name}: ${malt.amount} kg`).join('\n')}
      
      Hops:
      ${recipe.ingredients.hops.map(hop => `${hop.name}: ${hop.amount} kg (${hop.timing})`).join('\n')}
      
      Yeast: ${recipe.ingredients.yeast}
      Water: ${recipe.ingredients.water} liters
    `;
    const brewingInstructions = `
      Brewing Instructions:
      ${recipe.brewing_instructions.map(instruction => `${instruction.step}. ${instruction.description}`).join('\n')}
    `;

    // Add Watermark
    doc.setFontSize(50);
    doc.setTextColor(150, 150, 150);
    doc.text('BeerNation', 50, 150, { angle: 45 });

    // Add Recipe Title and Content
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 20, 20);

    // Add Ingredients
    doc.setFontSize(12);
    doc.text('Ingredients', 20, 40);
    doc.text(ingredients, 20, 50);

    // Add Brewing Instructions
    doc.text('Brewing Instructions', 20, 100);
    doc.text(brewingInstructions, 20, 110);

    // Add Message
    doc.setFontSize(10);
    doc.text('Thank you for visiting BeerNation!', 20, doc.internal.pageSize.height - 20);

    // Save the PDF
    doc.save(`${recipe.name}_Recipe.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Create Your Recipe
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="beerStyle">
            Select Beer Style
          </label>
          <div className="relative">
            <div
              className="block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {beerName || 'Choose a style'}
            </div>
            {isDropdownOpen && (
              <ul
                className="absolute bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full mt-1 z-10"
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                {beerStyles.map((style) => (
                  <li
                    key={style}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setBeerName(style);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {style}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
            Batch Size (Liters)
          </label>
          <div className="relative">
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="5"
              max="70"
              className="block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
            />
          </div>
        </div>

        <button
          onClick={generateRecipe}
          disabled={!beerName || loading}
          className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Generating Recipe...
            </>
          ) : (
            'Generate Recipe'
          )}
        </button>
      </div>

      {recipe && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{recipe.name} Recipe</h2>
          <p className="text-gray-600 mb-6">Batch Size: {quantity} liters</p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Malts:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {recipe.ingredients.malts.map((malt, index) => (
                    <li key={index}>{malt.name}: {malt.amount} kg</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Hops:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {recipe.ingredients.hops.map((hop, index) => (
                    <li key={index}>{hop.name}: {hop.amount} kg ({hop.timing})</li>
                  ))}
                </ul>
              </div>
              {recipe.ingredients.spices && recipe.ingredients.spices.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900">Spices:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {recipe.ingredients.spices.map((spice, index) => (
                      <li key={index}>{spice.name}: {spice.amount} kg ({spice.timing})</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900">Yeast:</h4>
                <p className="text-gray-600">{recipe.ingredients.yeast}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Water:</h4>
                <p className="text-gray-600">{recipe.ingredients.water} liters</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Brewing Instructions</h3>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.brewing_instructions.map((instruction) => (
                <li key={instruction.step} className="text-gray-600">
                  {instruction.description}
                </li>
              ))}
            </ol>
          </div>

          <button
            onClick={downloadPDF}
            className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Download PDF Recipe
          </button>
        </div>
      )}

      {!recipe && !loading && (
        <div className="text-center text-gray-600">
          <p>Select your preferred beer style and batch size to generate a custom recipe.</p>
          <p>The recipe will include all necessary ingredients and detailed brewing instructions.</p>
        </div>
      )}
    </div>
  );
}

export default RecipeCreator;


// function RecipeCreator() {
//   const [beerStyle, setBeerStyle] = useState('');
//   const [quantity, setQuantity] = useState(20);
//   const [loading, setLoading] = useState(false);
//   const [recipe, setRecipe] = useState(null);

//   const beerStyles = [
//     'Altbier',
//     'Amber Ale',
//     'American Brown Ale',
//     'American Pale Ale',
//     'American Porter',
//     'American IPA',
//     'American Wheat Beer',
//     'Barleywine',
//     'Belgian Tripel',
//     'Belgian Dubbel',
//     'Belgian Blonde Ale',
//     'Berliner Weisse',
//     'Bière de Garde',
//     'Black IPA',
//     'Blonde Ale',
//     'Bohemian Pilsner',
//     'Cream Ale',
//     'Double IPA DIPA',
//     'Dunkel',
//     'Dunkelweizen',
//     'English Bitter',
//     'English IPA',
//     'English Pale Ale',
//     'Farmhouse Ale',
//     'Flanders Red Ale',
//     'German Pilsner',
//     'Golden Ale',
//     'Gose',
//     'Grisette',
//     'Hefeweizen',
//     'Imperial Stout',
//     'Kölsch',
//     'Imperial IPA',
//     'Irish Stout',
//     'Lambic',
//     'Märzen',
//     'Milk Stout',
//     'Mild Ale',
//     'Munich Helles',
//     'New England IPA NEIPA',
//     'Oatmeal Stout',
//     'Porter',
//     'Pumpkin Ale',
//     'Rauchbier',
//     'Russian Imperial Stout',
//     'Saison',
//     'Session IPA',
//     'Scotch Ale',
//     'Vienna Lager',
//     'Weizenbock',
//     'West Coast IPA',
//     'Witbier'
//   ].sort();

//   const generateRecipe = () => {
//     setLoading(true);
    
//     // Call BeerRecipe.json file
//     setTimeout(() => {
//       const recipe = {
//         name: beerStyle,
//         batchSize: quantity,
//         ingredients: {
//           malts: [
//             { name: 'Pale Malt', amount: `${(quantity * 0.25).toFixed(2)} kg` },
//             { name: 'Crystal Malt', amount: `${(quantity * 0.025).toFixed(2)} kg` }
//           ],
//           hops: [
//             { name: 'Cascade', amount: `${(quantity * 0.002).toFixed(2)} kg`, timing: '60 min' },
//             { name: 'Citra', amount: `${(quantity * 0.001).toFixed(2)} kg`, timing: '15 min' }
//           ],
//           yeast: 'Safale US-05 American Ale',
//           water: `${quantity} liters`
//         },
//         instructions: [
//           { step: 1, description: 'Heat water to 67°C (152°F)' },
//           { step: 2, description: 'Add malts and maintain temperature for 60 minutes' },
//           { step: 3, description: 'Raise temperature to 75°C (167°F) for mash out' },
//           { step: 4, description: 'Sparge with 78°C (172°F) water' },
//           { step: 5, description: 'Bring to boil and add hops according to schedule' },
//           { step: 6, description: 'Cool to 20°C (68°F) and pitch yeast' },
//           { step: 7, description: 'Ferment at 20°C (68°F) for 14 days' }
//         ]
//       };
      
//       setRecipe(recipe);
//       setLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//         Create Your Recipe
//       </h1>

//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="beerStyle">
//             Select Beer Style
//           </label>
//           <div className="relative">
//             <select
//               id="beerStyle"
//               value={beerStyle}
//               onChange={(e) => setBeerStyle(e.target.value)}
//               className="block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
//             >
//               <option value="">Choose a style</option>
//               {beerStyles.map((style) => (
//                 <option key={style} value={style}>
//                   {style}
//                 </option>
//               ))}
//             </select>
//             <Beer className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//           </div>
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
//             Batch Size (Liters)
//           </label>
//           <div className="relative">
//             <input
//               type="number"
//               id="quantity"
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               min="5"
//               max="50"
//               className="block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
//             />
//             <Scale className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
//           </div>
//         </div>

//         <button
//           onClick={generateRecipe}
//           disabled={!beerStyle || loading}
//           className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
//         >
//           {loading ? (
//             <>
//               <Loader2 className="animate-spin h-5 w-5 mr-2" />
//               Generating Recipe...
//             </>
//           ) : (
//             'Generate Recipe'
//           )}
//         </button>
//       </div>

//       {recipe && (
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">{recipe.name} Recipe</h2>
//           <p className="text-gray-600 mb-6">Batch Size: {recipe.batchSize} liters</p>

//           <div className="mb-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h3>
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-gray-900">Malts:</h4>
//                 <ul className="list-disc list-inside text-gray-600">
//                   {recipe.ingredients.malts.map((malt, index) => (
//                     <li key={index}>{malt.name}: {malt.amount}</li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Hops:</h4>
//                 <ul className="list-disc list-inside text-gray-600">
//                   {recipe.ingredients.hops.map((hop, index) => (
//                     <li key={index}>{hop.name}: {hop.amount} ({hop.timing})</li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Yeast:</h4>
//                 <p className="text-gray-600">{recipe.ingredients.yeast}</p>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Water:</h4>
//                 <p className="text-gray-600">{recipe.ingredients.water}</p>
//               </div>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-3">Brewing Instructions</h3>
//             <ol className="list-decimal list-inside space-y-2">
//               {recipe.instructions.map((instruction) => (
//                 <li key={instruction.step} className="text-gray-600">
//                   {instruction.description}
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </div>
//       )}

//       {!recipe && !loading && (
//         <div className="text-center text-gray-600">
//           <p>Select your preferred beer style and batch size to generate a custom recipe.</p>
//           <p>The recipe will include all necessary ingredients and detailed brewing instructions.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default RecipeCreator;