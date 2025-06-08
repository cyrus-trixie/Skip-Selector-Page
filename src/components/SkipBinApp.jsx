import React, { useState, useEffect } from 'react';
//
import { Trash2, ArrowRight, MapPin, Check, Loader, AlertCircle, Info, Scale, ScrollText } from 'lucide-react';

const SkipBinApp = () => {
  const [selectedAddress, setSelectedAddress] = useState('Leicester, LE10 1SH'); 
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [skipData, setSkipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch skip data from API
  useEffect(() => {
    const fetchSkipData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft');
        if (!response.ok) throw new Error('Failed to fetch skip data');
        const data = await response.json();
        setSkipData(data);
      } catch (err) {
        setError(err.message);
        // Fallback to mock data if API fails
        setSkipData([
          { "id": 17933, "size": 4, "hire_period_days": 14, "price_before_vat": 278, "vat": 20, "allows_heavy_waste": true, "allowed_on_road": true },
          { "id": 17934, "size": 6, "hire_period_days": 14, "price_before_vat": 305, "vat": 20, "allows_heavy_waste": true, "allowed_on_road": true },
          { "id": 17935, "size": 8, "hire_period_days": 14, "price_before_vat": 375, "vat": 20, "allows_heavy_waste": false, "allowed_on_road": true },
          { "id": 17936, "size": 10, "hire_period_days": 14, "price_before_vat": 450, "vat": 20, "allows_heavy_waste": true, "allowed_on_road": false }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkipData();
  }, []);

  // Transform API data to UI-friendly format
  const transformedSkips = skipData.map((skip) => {
    const totalPrice = Math.round(skip.price_before_vat * (1 + skip.vat / 100));

    const getSkipDescription = (size) => {
      const descriptions = {
        4: 'Perfect for small garden and minor DIY projects.',
        6: 'Great for medium garden projects and small renovations.',
        8: 'Ideal for kitchen renovations and large garden clearances.',
        10: 'Suitable for major home improvements and bulky waste.'
      };
      return descriptions[size] || 'Suitable for various projects.';
    };

    const getRelatableCapacity = (size) => {
      const capacities = {
        4: '~40 black bags / 2 sofas',
        6: '~60 black bags / 3 sofas',
        8: '~80 black bags / 1 kitchen',
        10: '~100 black bags / Large house clearance'
      };
      return capacities[size] || 'Approx. capacity for your waste.';
    };

    return {
      id: skip.id,
      name: `${skip.size} Yard Skip`,
      size: skip.size,
      capacity: `${skip.size} cubic yards`,
      relatableCapacity: getRelatableCapacity(skip.size), // New relatable capacity
      description: getSkipDescription(skip.size),
      price: totalPrice,
      hirePeriod: skip.hire_period_days,
      allowsHeavyWaste: skip.allows_heavy_waste,
      allowedOnRoad: skip.allowed_on_road,
    };
  });

  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-800">Loading Skip Options...</h2>
        <p className="text-gray-500 text-sm">Finding the best options for you.</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
      <div className="text-center max-w-sm bg-white p-6 rounded-lg shadow-md">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Could Not Load Data</h2>
        <p className="text-gray-600 mb-4">We're experiencing issues. Displaying sample data instead.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
        >
          Reload Page
        </button>
      </div>
    </div>
  );

  const SkipCard = ({ skip }) => (
    <div
      onClick={() => setSelectedSkip(skip)}
      className={`
        relative bg-white rounded-lg shadow-sm cursor-pointer transition-all duration-200 flex flex-col h-full
        ${selectedSkip?.id === skip.id
          ? 'ring-2 ring-indigo-500 shadow-md'
          : 'hover:shadow-md hover:scale-[1.02]'
        }
        p-5
      `}
    >
      <div className="text-center mb-4">
        <div className={`
          ${selectedSkip?.id === skip.id ? 'bg-indigo-50' : 'bg-gray-50'}
          rounded-full flex items-center justify-center mx-auto mb-3 w-14 h-14 transition-colors
        `}>
          <Trash2 className={`w-7 h-7 ${selectedSkip?.id === skip.id ? 'text-indigo-600' : 'text-gray-600'}`} />
        </div>
        <h3 className="font-semibold text-gray-900 text-xl mb-1">{skip.name}</h3>
        <p className="text-indigo-600 text-sm">{skip.capacity}</p>
        <p className="text-gray-500 text-xs mt-1 flex items-center justify-center">
            <Scale className="w-3 h-3 mr-1" />
            <span>{skip.relatableCapacity}</span>
        </p>
      </div>

      <p className="text-gray-600 text-sm text-center mb-4 flex-grow">{skip.description}</p>

      {/* Enhanced Features Display */}
      <div className="flex justify-center space-x-3 mb-4 text-sm">
        {skip.allowsHeavyWaste ? (
          <span className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded-full">
            <Check className="w-4 h-4 mr-1" /> Heavy Waste
          </span>
        ) : (
          <span className="flex items-center text-red-700 bg-red-50 px-2 py-1 rounded-full">
            <Trash2 className="w-4 h-4 mr-1" /> No Heavy Waste
          </span>
        )}
        {skip.allowedOnRoad ? (
          <span className="flex items-center text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
            <ScrollText className="w-4 h-4 mr-1" /> Road Permit
          </span>
        ) : (
          <span className="flex items-center text-orange-700 bg-orange-50 px-2 py-1 rounded-full">
            <MapPin className="w-4 h-4 mr-1" /> Private Only
          </span>
        )}
      </div>

      <div className="text-center mt-auto"> {/* Pushes pricing to bottom */}
        <p className="text-2xl font-bold text-gray-900 mb-1">£{skip.price}</p>
        <p className="text-xs text-gray-500 mb-4">Inc. VAT • {skip.hirePeriod} days</p>

        <button className={`
          w-full py-3 rounded-md font-semibold text-sm transition-colors duration-150
          ${selectedSkip?.id === skip.id
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
        `}>
          {selectedSkip?.id === skip.id ? (
            <span className="flex items-center justify-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Selected</span>
            </span>
          ) : (
            <span>Select Skip</span>
          )}
        </button>
      </div>
    </div>
  );

  const SizeStep = () => (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm py-5">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Choose Your Skip Size</h1>
            <p className="text-gray-600 text-sm flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1 text-gray-500" />
              <span>For <span className="font-medium text-indigo-600">{selectedAddress}</span> (Garden Waste)</span>
            </p>
          </div>
        </div>
      </header>

      
      <main className="p-4 pb-28"> 
        <div className="max-w-6xl mx-auto">

         
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mb-8 rounded-md flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Not sure what size you need?</h3>
              <p className="text-sm">
                Choosing the right skip can be tricky. Consider the volume of your waste and the type of materials. <a href="#" className="underline font-medium hover:text-blue-900">View our detailed Skip Size Guide</a> for help.
              </p>
            </div>
          </div>


          {transformedSkips.length === 0 && !loading && !error ? (
            <div className="text-center text-gray-600 py-10">No skip options available for this location.</div>
          ) : (
            <>
              {/* Mobile: Horizontal scroll */}
              <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex space-x-4">
                  {transformedSkips.map((skip) => (
                    <div key={skip.id} className="flex-none w-64"> 
                      <SkipCard skip={skip} />
                    </div>
                  ))}
                </div>
              </div>

            
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {transformedSkips.map((skip) => (
                  <SkipCard key={skip.id} skip={skip} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>


      {selectedSkip && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-3">
              
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-base">{selectedSkip.name}</h4>
                <p className="text-gray-600 text-sm">
                    <span className="font-medium text-indigo-600">£{selectedSkip.price}</span> • {selectedSkip.hirePeriod} days hire
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Selected ${selectedSkip.name}. Proceeding to booking...`)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold text-base hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <span>Continue to Book</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Conditional rendering for main states
  if (loading) return <LoadingState />;
  if (error && transformedSkips.length === 0) return <ErrorState />; // Only show error if no data, fallback has data
  return <SizeStep />;
};

export default SkipBinApp;