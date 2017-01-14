import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


const ColorCanvas = ({ currentColor }) => (
    <div
        style={{
            backgroundColor: currentColor,
            height: '100%',
            width: '100%',
            position: 'fixed',
        }}
    />
);

ColorCanvas.props = {
    currentColor: PropTypes.string.isRequired,
};

const mapStateToProps = ({ canvas }) => ({
    currentColor: canvas.currentColor,
});

export default connect(mapStateToProps)(ColorCanvas);
