import React, { PropTypes } from 'react';

const ControlButton = ({ label, onClick }) => (
    <div style={styles.wrapper}>
        <button type='button' onClick={onClick}>
            {label}
        </button>
    </div>
);

const styles = {
    wrapper: {

    },
};

ControlButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default ControlButton;
