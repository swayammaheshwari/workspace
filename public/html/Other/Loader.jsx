import React, { useState, useEffect } from "react";

// Loader component
const Loader = () => {
  return (
    <div className="loader">
      <h2>Loading...</h2>
    </div>
  );
};

// Main component
const MainComponent = () => {
  return (
    <div>
      <h1>Welcome to My Website!</h1>
      {/* Add your main component content here */}
    </div>
  );
};

// App component
const Tester = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return <div>{showLoader ? <Loader /> : <MainComponent />}</div>;
};

export default Tester;
