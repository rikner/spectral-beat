import React, { PropTypes } from 'react';

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
        color: 'white',
        padding: '0.5em',
        fontFamily: 'Allerta Stencil',
        fontSize: 18,
        cornerRadius: 3,
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: 10,
        borderWidth: 2,

    },
};

ControlButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default ControlButton;
