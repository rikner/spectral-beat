import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import actions from '/client/actions/actionCreators';
import InputRange from 'react-input-range';

const propTypes = {
    setThreshold: PropTypes.func.isRequired,
    toggleAutoThresholdIsActive: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired,
    autoThresholdIsActive: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    threshold: state.onsetDetection.onsetData.threshold,
    autoThresholdIsActive: state.onsetDetection.autoThresholdIsActive,
});

const mapDispatchToProps = {
    setThreshold: actions.setThreshold,
    toggleAutoThresholdIsActive: actions.toggleAutoThresholdIsActive,
};

class ThresholdController extends Component {
    constructor() {
        super();
        this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
    }

    toggleCheckboxChange() {
        this.props.toggleAutoThresholdIsActive();
    }

    handleRangeChange(value) {
        console.log(value);
        this.props.setThreshold(value);
    }

    render() {
        const autoTresholdIsOn = this.props.autoThresholdIsActive;
        return (
            <div>
                <input
                    type='checkbox'
                    checked={autoTresholdIsOn}
                    onChange={this.toggleCheckboxChange}
                />
                <label htmlFor='autoThresholdIsActive'>Auto Threshold</label>
                <InputRange
                    ref={(component) => { this.inputRange = component; }}
                    onChange={this.handleRangeChange}
                    value={this.props.threshold}
                    minValue={0}
                    maxValue={100}
                />
            </div>
        );
    }
}

ThresholdController.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdController);
