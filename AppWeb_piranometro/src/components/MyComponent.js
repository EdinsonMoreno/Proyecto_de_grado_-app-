import React from 'react';

const MyComponent = () => {
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    // Código que usa window
    console.log(window.innerWidth);
  }

  return (
    <div>
      {/* Tu componente */}
    </div>
  );
};

export default MyComponent;