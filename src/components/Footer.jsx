const Footer = () => {
  return (
    <footer className="bg-gray-800 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>© {new Date().getFullYear()} Smart Roulette. All rights reserved.</p>
        <p className="mt-2 text-sm">
          Powered by Ethereum blockchain and Chainlink VRF for guaranteed
          randomness.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
