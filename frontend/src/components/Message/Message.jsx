import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar o CSS do Bootstrap

const Message = ({ type, text }) => {
  const alertClass = type;

  if (type !== 'success') {
    type = 'danger';
  }

  return (
    <div className={`alert alert-${alertClass}`} role="alert">
      {text}
    </div>
  );
};

export default Message;
