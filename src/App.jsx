import { useState } from "react";
import "./App.css";
import { LotteryProvider } from "./components/lotteryContext";
import Navbar from "./components/Navbar";
import LotteryCard from "./components/LotteryCard";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";

//Rainbow Kit and Wagmi imports
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "d886168773f71705581e135b1d8104e8",
  chains: [sepolia],
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <LotteryProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold mb-6 text-center">
                    Smart Roulette
                  </h1>
                  <p className="text-lg mb-8 text-center max-w-2xl">
                    Enter the lottery for a chance to win! When conditions are
                    met, a random winner will be selected automatically.
                  </p>

                  <LotteryCard />
                  <AdminPanel />
                </div>
              </div>
              <Footer />
            </div>
          </LotteryProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
