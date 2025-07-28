// import { useState } from "react";
// import { useWallet } from "./walletContext";

// const Navbar = () => {
//   const { account, connectWallet, disconnectWallet, isConnecting } =
//     useWallet();

//   // Format account address for display
//   const formatAddress = (address) => {
//     if (!address) return "";
//     return `${address.substring(0, 6)}...${address.substring(
//       address.length - 4
//     )}`;
//   };

//   return (
//     <nav className="bg-gray-800 p-4 shadow-md">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="text-xl font-bold text-white">Smart Roulette</div>

//         <div className="flex items-center space-x-4">
//           {account ? (
//             <div className="flex items-center space-x-3">
//               <span className="bg-green-500 h-2 w-2 rounded-full"></span>
//               <span className="hidden md:inline text-white">
//                 {formatAddress(account)}
//               </span>
//               <button
//                 onClick={disconnectWallet}
//                 className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-300"
//               >
//                 Disconnect
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={connectWallet}
//               disabled={isConnecting}
//               className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center space-x-2"
//             >
//               {isConnecting ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   <span>Connecting...</span>
//                 </>
//               ) : (
//                 <span>Connect Wallet</span>
//               )}
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => (
  <nav className="bg-gray-800 p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-xl font-bold text-white">Smart Roulette</div>
      <ConnectButton />
    </div>
  </nav>
);

export default Navbar;
