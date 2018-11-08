import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import * as actions from '../actions';

const propTypes = {
    onsetGraphScale: PropTypes.number.isRequired,
    setOnsetGraphScale: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    onsetGraphScale: state.onsetDetection.graphScale,
});

const mapDispatchToProps = {
    setOnsetGraphScale: actions.setOnsetGraphScale,
};


class OnsetScaler extends Component {
    render() {
        const { graphScale, setOnsetGraphScale } = this.props;

        return (

                <Slider
                    min={100}
                    max={10000000}
                    step={0.00001}
                    onChange={(value) => {
                        setOnsetGraphScale(value);
                    }}
                    vertical
                    style={{
                        alignItems: 'stretch',
                        backgroundColor: 'red',
                        display: 'flex',
                        height: 300,
                        width: 20,
                    }}
                />

        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(OnsetScaler);