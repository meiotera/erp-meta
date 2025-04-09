import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar o CSS do Bootstrap

const Message = ({ type, text }) => {
  if (type !== 'success') {
    type = 'danger';
  }

  return (
    <div className={`alert alert-${type}`} role="alert">
      {text}
    </div>
  );
};

export default Message;
