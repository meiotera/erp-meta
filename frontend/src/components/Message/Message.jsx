import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar o CSS do Bootstrap

const Message = ({ type, text }) => {
    const alertClass = type

    return (
        <div className={`alert ${alertClass}`} role="alert">
            {text}
        </div>
    );
};

export default Message;