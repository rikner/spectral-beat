import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import actions from '/client/actions/actionCreators';
import Range from '@mapbox/react-range';

const propTypes = {
    setThreshold: PropTypes.func.isRequired,
    setCalculateThreshold: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired,
    autoThreshold: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    threshold: state.onsetDetection.onsetData.threshold,
    autoThreshold: state.onsetDetection.autoThreshold,
});

const mapDispatchToProps = {
    setThreshold: actions.setThreshold,
    setCalculateThreshold: actions.setCalculateThreshold,
};

class ThresholdController extends Component {
    constructor() {
        super();
        this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
    }

    toggleCheckboxChange() {
        this.props.setCalculateThreshold(!this.props.autoThreshold);
    }

    handleRangeChange() {
        this.props.setThreshold(this.rangeInput.value);
    }

    render() {
        const autoTresholdIsOn = this.props.autoThreshold;
        return (
            <div>
                <input
                    type='checkbox'
                    checked={autoTresholdIsOn}
                    onChange={this.toggleCheckboxChange}
                />
                <label htmlFor='autoThreshold'>Auto Threshold</label>
                <Range
                    ref={(component) => { this.rangeInput = component; }}
                    className='slider'
                    onChange={this.handleRangeChange}
                    type='range'
                    value={this.props.threshold}
                    min={0}
                    max={100}
                />
            </div>
        );
    }
}

ThresholdController.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdController);
