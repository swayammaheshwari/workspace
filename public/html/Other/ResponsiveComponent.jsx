import React, { useState, useEffect } from "react";

const ResponsiveComponent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {isMobile ? <h2>Mobile Component</h2> : <h2>Desktop Component</h2>}
    </div>
  );
};

export default ResponsiveComponent;
