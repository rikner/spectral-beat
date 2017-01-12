import React, { PropTypes } from 'react';

const Button = ({ label, onClick }) => (
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

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Button;
