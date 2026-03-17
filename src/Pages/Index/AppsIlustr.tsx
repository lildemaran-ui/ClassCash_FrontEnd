import Card1 from "../../assets/Card1PI.jpeg";
import Card2 from "../../assets/Card2PI.jpeg";
import Card3 from "../../assets/Card3PI.jpeg";

export default function AppsIlustr() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center px-4 sm:px-6 lg:px-10 mt-10 mb-10 animate-fade-in">
      
      <div className="w-full max-w-xs sm:max-w-none h-56 sm:h-64 lg:h-72 bg-gray-100 rounded-lg overflow-hidden">
        <img src={Card1} alt="App Accounts" className="w-full h-full object-cover rounded-lg" />
      </div>

      <div className="w-full max-w-xs sm:max-w-none h-56 sm:h-64 lg:h-72 bg-gray-100 rounded-lg overflow-hidden">
        <img src={Card2} alt="App Accounts" className="w-full h-full object-cover rounded-lg" />
      </div>

      <div className="w-full max-w-xs sm:max-w-none h-56 sm:h-64 lg:h-72 bg-gray-100 rounded-lg overflow-hidden sm:col-span-2 lg:col-span-1">
        <img src={Card3} alt="App Accounts" className="w-full h-full object-cover rounded-lg" />
      </div>

    </div>
  );
}