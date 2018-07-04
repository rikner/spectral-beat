import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    handleThresholdChange = (event) => {
        this.props.setUserThreshold(parseFloat(event.target.value));
    }

    render() {
        const { autoThresholdIsActive, userThreshold, toggleAutoThresholdIsActive } = this.props;
        return (
            <div>
                <label htmlFor='autoThresholdIsActive'>Auto Threshold</label>
                <input
                    type='checkbox'
                    name='autoThresholdIsActive'
                    checked={autoThresholdIsActive}
                    onChange={toggleAutoThresholdIsActive}
                />

                {!autoThresholdIsActive && 
                    <input
                        type='range'
                        name='threshold'
                        onChange={this.handleThresholdChange}
                        min={0}
                        max={2.5}
                        step={0.001}
                    />
                }
                
                {!autoThresholdIsActive && 
                    <label>{userThreshold}</label>
                }
                 
            </div>
        );
    }
}

ThresholdController.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdController);
