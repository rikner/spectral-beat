import React from 'react';
import PropTypes from 'prop-types';

const ControlButton = ({ label, onClick }) => (
    <div style={styles.button} onClick={onClick}>
        {label}
    </div>
);

const styles = {
    button: {
        width: 100,
        textAlign: 'center',
        backgroundColor: 'black',
        opacity: 0.5,
        color: 'white',
        padding: '0.5em',
        fontSize: 18,
        cornerRadius: 3,
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: 7,
        borderWidth: 2,

    },
};

ControlButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default ControlButton;
