import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import actions from '/client/actions/actionCreators';

const propTypes = {
    setThreshold: PropTypes.func.isRequired,
    setCalculateThreshold: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired,
    calculateThreshold: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    threshold: state.onsetDetection.onsetData.threshold,
    calculateThreshold: state.onsetDetection.calculateThreshold,
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
        this.props.setCalculateThreshold(!this.props.calculateThreshold);
    }

    handleRangeChange() {

    }

    render() {
        const autoTresholdIsOn = this.props.calculateThreshold;
        return (
            <div>
                <input
                    type='checkbox'
                    checked={autoTresholdIsOn}
                    onChange={this.toggleCheckboxChange}
                />
                <label htmlFor='calculateThreshold'>Auto Threshold</label>

                <input
                    type='range'
                    value={this.props.threshold}
                    onChange={this.handleRangeChange}
                    disable={autoTresholdIsOn}
                />
            </div>
        );
    }
}

ThresholdController.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdController);
