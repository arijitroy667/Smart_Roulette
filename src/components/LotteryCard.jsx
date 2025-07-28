import { useState } from "react";
import { useAccount } from "wagmi";
import { useLottery } from "./lotteryContext";

const LotteryCard = () => {
  const { address: account, isConnected } = useAccount();
  const {
    entranceFee,
    players,
    recentWinner,
    raffleState,
    loading,
    error,
    enterLottery,
  } = useLottery();

  const [timeRemaining, setTimeRemaining] = useState(null);

  const handleEnterLottery = async () => {
    await enterLottery();
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Lottery Status</h2>
        <div className="flex items-center mt-2">
          <span
            className={`h-3 w-3 rounded-full ${
              raffleState === 0 ? "bg-green-400" : "bg-yellow-400"
            } mr-2`}
          ></span>
          <span>{raffleState === 0 ? "OPEN" : "CALCULATING WINNER"}</span>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Lottery Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Entrance Fee:</p>
              <p className="text-xl font-medium">{entranceFee} ETH</p>
            </div>
            <div>
              <p className="text-gray-400">Players:</p>
              <p className="text-xl font-medium">{players.length}</p>
            </div>
            {recentWinner && (
              <div className="col-span-2">
                <p className="text-gray-400">Recent Winner:</p>
                <p className="text-green-400 font-medium truncate">
                  {recentWinner}
                </p>
              </div>
            )}
          </div>
        </div>

        {isConnected ? (
          <button
            onClick={handleEnterLottery}
            disabled={loading || raffleState !== 0}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white 
              ${
                raffleState === 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed"
              } transition duration-300 flex justify-center items-center`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : raffleState !== 0 ? (
              "Calculating Winner..."
            ) : (
              `Enter Lottery (${entranceFee} ETH)`
            )}
          </button>
        ) : (
          <div className="text-center text-yellow-500 font-medium">
            Connect your wallet to enter the lottery
          </div>
        )}

        {players.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Current Players</h3>
            <div className="max-h-40 overflow-y-auto">
              <ul className="space-y-2">
                {players.map((player, index) => (
                  <li
                    key={index}
                    className="bg-gray-700 rounded-md px-3 py-2 flex items-center"
                  >
                    <span className="bg-blue-500 text-xs font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span className="truncate">{player}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryCard;
