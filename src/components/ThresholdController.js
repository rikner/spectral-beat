import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import * as actions from '../actions';

const propTypes = {
    autoThresholdIsActive: PropTypes.bool.isRequired,
    setUserThreshold: PropTypes.func.isRequired,
    toggleAutoThresholdIsActive: PropTypes.func.isRequired,
    userThreshold: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    autoThresholdIsActive: state.onsetDetection.autoThresholdIsActive,
    userThreshold: state.onsetDetection.userThreshold,
});


const mapDispatchToProps = {
    setUserThreshold: actions.setThreshold,
    toggleAutoThresholdIsActive: actions.toggleAutoThresholdIsActive,
};



class ThresholdController extends Component {
    handleThresholdChange = value => {
        this.props.setUserThreshold(parseFloat(value));
    }

    render() {
        const { autoThresholdIsActive, userThreshold, toggleAutoThresholdIsActive } = this.props;
        return (
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: 'blue',
                    borderColor: '#CCCCCC',
                    borderRadius: 7,
                    borderStyle: 'solid',
                    borderWidth: 4,
                    cornerRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    opacity: 0.75,
                    padding: '1em',
                }}
            >
                <div
                    htmlFor='manualThreshold'
                    style={{
                        marginBottom: '0.7em'
                    }}
                >
                    <input
                        type='checkbox' 
                        name='manualThreshold'
                        checked={!autoThresholdIsActive}
                        onChange={toggleAutoThresholdIsActive}
                    />
                    Manual Threshold
                </div>


                <Slider
                    min={0}
                    max={0.02}
                    step={0.00001}
                    onChange={this.handleThresholdChange}
                    disabled={autoThresholdIsActive}
                />

            </div>
        );
    }
}

ThresholdController.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdController);
