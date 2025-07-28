import { useState } from "react";
import { useAccount } from "wagmi";
import { useLottery } from "./lotteryContext";

const AdminPanel = () => {
  const { address: account, isConnected } = useAccount();
  const {
    isAdmin,
    toggleRaffleStatus,
    loading,
    setRaffleFeePercentage,
    raffleFee,
  } = useLottery();

  const [newFee, setNewFee] = useState(raffleFee || 5);

  if (!isConnected || !isAdmin) {
    return null; // Only show admin panel to admin
  }

  const handleToggle = async () => {
    await toggleRaffleStatus();
  };

  const handleFeeChange = async (e) => {
    e.preventDefault();
    if (newFee >= 0 && newFee <= 100) {
      await setRaffleFeePercentage(Number(newFee));
    }
  };

  return (
    <div className="w-full max-w-lg bg-gray-800 border border-red-500 rounded-lg shadow-xl overflow-hidden mb-8">
      <div className="bg-red-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Emergency Controls</h3>
            <button
              onClick={handleToggle}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-bold transition duration-300"
            >
              {loading ? "Processing..." : "Toggle Raffle Status"}
            </button>
            <p className="text-gray-400 text-sm mt-2">
              Use this in emergency to pause/resume the raffle.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Raffle Fee Settings</h3>
            <form onSubmit={handleFeeChange} className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={newFee}
                onChange={(e) => setNewFee(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Set Fee %
              </button>
            </form>
            <p className="text-gray-400 text-sm mt-2">
              Current fee: {raffleFee}% of the pot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
