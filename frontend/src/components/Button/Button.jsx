import React from 'react';

const Button = ({ children, className, action, id }) => {
  return (
    <button onClick={() => action(id)} className={`btn ${className}`}>
      {children}
    </button>
  );
};

export default Button;
