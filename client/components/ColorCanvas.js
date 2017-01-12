import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


const ColorCanvas = ({ currentColor }) => {
    return (
        <div
            style={{
                backgroundColor: currentColor,
                height: 600,
                width: 600,
            }}
        >
            ColorCanvas
        </div>
    );
};

ColorCanvas.props = {
    currentColor: PropTypes.string.isRequired,
};

const mapStateToProps = ({ canvas }) => ({
    currentColor: canvas.currentColor,
});

export default connect(mapStateToProps)(ColorCanvas);
