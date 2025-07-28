import { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";

// Import ABI
import RaffleAbi from "../ABI/ABI.json";

export const LotteryContext = createContext();

export const LotteryProvider = ({ children }) => {
  // Contract address - replace with your deployed contract address
  const RAFFLE_CONTRACT_ADDRESS = import.meta.env.VITE_RAFFLE_CONTRACT_ADDRESS;

  const { address: account, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [entranceFee, setEntranceFee] = useState("0");
  const [players, setPlayers] = useState([]);
  const [recentWinner, setRecentWinner] = useState(null);
  const [raffleState, setRaffleState] = useState(0); // 0 = OPEN, 1 = CALCULATING
  const [raffleFee, setRaffleFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastTimeStamp, setLastTimeStamp] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [contract, setContract] = useState(null);

  const refreshRaffleState = async () => {
    try {
      const state = await contract.getRaffleState();
      setRaffleState(Number(state));
    } catch (err) {
      console.error("Error refreshing raffle state:", err);
    }
  };

  // Initialize contract with walletClient (wagmi)
  useEffect(() => {
    if (!walletClient) return;
    const ethersProvider = new ethers.BrowserProvider(walletClient.transport);
    const contractInstance = new ethers.Contract(
      RAFFLE_CONTRACT_ADDRESS,
      RaffleAbi,
      ethersProvider
    );
    setContract(contractInstance);
  }, [walletClient]);

  // Load contract data and set up listeners
  useEffect(() => {
    if (!contract) return;

    const loadContractData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get entrance fee
        const fee = await contract.getEntranceFee();
        setEntranceFee(ethers.formatEther(fee));

        // Get raffle state
        const state = await contract.getRaffleState();
        setRaffleState(Number(state));

        // Get recent winner if available
        try {
          const winner = await contract.getRecentWinner();
          if (winner && winner !== ethers.ZeroAddress) {
            setRecentWinner(winner);
          }
        } catch (e) {
          // No winner yet
        }

        // Get raffle fee
        const fee_percentage = await contract.getRaffleFee();
        setRaffleFee(fee_percentage.toString() / 100);

        // Get last timestamp
        const timestamp = await contract.getLastTimeStamp();
        setLastTimeStamp(Number(timestamp));

        // Check if current user is admin
        if (account) {
          try {
            const owner = await contract.raffleOwner();
            setIsAdmin(owner && owner.toLowerCase() === account.toLowerCase());
          } catch {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }

        // Load all players
        await updatePlayers();
      } catch (err) {
        console.error("Error loading contract data:", err);
        setError("Failed to load lottery data");
      } finally {
        setLoading(false);
      }
    };

    loadContractData();

    // Set up event listeners
    const setupEventListeners = () => {
      contract.on("RaffleEntered", (player) => {
        updatePlayers();
        refreshRaffleState();
      });

      contract.on("WinnerPicked", (winner) => {
        setRecentWinner(winner);
        updatePlayers();
        refreshRaffleState();
      });

      contract.on("RaffleToggled", (status) => {
        loadContractData();
        refreshRaffleState();
      });
    };

    setupEventListeners();

    // Cleanup event listeners
    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
    // eslint-disable-next-line
  }, [contract, account]);

  // Function to update list of players
  const updatePlayers = async () => {
    if (!contract) return;

    try {
      const playersList = [];
      let i = 0;

      while (true) {
        try {
          const player = await contract.getPlayer(i);
          playersList.push(player);
          i++;
        } catch (e) {
          // No more players
          break;
        }
      }

      setPlayers(playersList);
    } catch (err) {
      console.error("Error updating players:", err);
    }
  };

  // Enter the lottery
  const enterLottery = async () => {
    if (!walletClient || !contract) return;
    setLoading(true);
    setError(null);

    try {
      const ethersProvider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await ethersProvider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const txResponse = await contractWithSigner.enterRaffle({
        value: ethers.parseEther(entranceFee),
      });
      await txResponse.wait();
      await updatePlayers();
    } catch (err) {
      console.error("Error entering lottery:", err);
      setError("Failed to enter lottery");
    } finally {
      setLoading(false);
    }
  };

  // Toggle raffle status (admin only)
  const toggleRaffleStatus = async () => {
    if (!walletClient || !contract || !isAdmin) return;

    setLoading(true);
    setError(null);

    try {
      const ethersProvider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await ethersProvider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const txResponse = await contractWithSigner.toggleRaffle();
      await txResponse.wait();
    } catch (err) {
      console.error("Error toggling raffle status:", err);
      setError("Failed to toggle raffle status");
    } finally {
      setLoading(false);
    }
  };

  // Set raffle fee (admin only)
  const setRaffleFeePercentage = async (newFee) => {
    if (!walletClient || !contract || !isAdmin) return;

    setLoading(true);
    setError(null);

    try {
      const ethersProvider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await ethersProvider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const feeInBasisPoints = Math.floor(newFee * 100);
      const txResponse = await contractWithSigner.setRaffleFee(
        feeInBasisPoints
      );
      await txResponse.wait();
    } catch (err) {
      console.error("Error setting raffle fee:", err);
      setError("Failed to set raffle fee");
    } finally {
      setLoading(false);
    }
  };

  // Refresh data periodically
  useEffect(() => {
    if (!contract) return;

    const intervalId = setInterval(async () => {
      try {
        const state = await contract.getRaffleState();
        setRaffleState(Number(state));

        // Update other dynamic data
        updatePlayers();

        try {
          const winner = await contract.getRecentWinner();
          if (winner && winner !== ethers.ZeroAddress) {
            setRecentWinner(winner);
          }
        } catch (e) {
          // No winner yet
        }
      } catch (err) {
        console.error("Error refreshing data:", err);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [contract]);

  return (
    <LotteryContext.Provider
      value={{
        entranceFee,
        players,
        recentWinner,
        raffleState,
        raffleFee,
        loading,
        error,
        isAdmin,
        enterLottery,
        toggleRaffleStatus,
        setRaffleFeePercentage,
        updatePlayers,
        timeRemaining,
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = () => useContext(LotteryContext);
