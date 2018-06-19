import React from 'react';
import PropTypes from 'prop-types';

const ControlButton = ({ label, onClick }) => (
    <div style={styles.button} onClick={onClick}>
        {label}
    </div>
);

const styles = {
    button: {
        backgroundColor: 'black',
        borderColor: 'white',
        borderRadius: 7,
        borderStyle: 'solid',
        borderWidth: 2,
        color: 'white',
        cornerRadius: 3,
        fontSize: 18,
        opacity: 0.5,
        padding: '0.5em',
        textAlign: 'center',
        width: 100,
    },
};

ControlButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default ControlButton;
