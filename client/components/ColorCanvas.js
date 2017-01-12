import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


const ColorCanvas = ({ currentColor }) => {
    return (
        <div className={'wrapper'} style={{ backgroundColor: currentColor }}>
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

// Sonifikation als Wegleiter für Blinde