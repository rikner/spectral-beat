import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const ColorCanvas = ({ currentColor }) => (
    <div
        style={{
            backgroundColor: currentColor,
            height: '100%',
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
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
