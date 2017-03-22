import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import actions from '/client/actions/actionCreators';

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
        this.handleThresholdChange = this.handleThresholdChange.bind(this);
    }

    toggleCheckboxChange() {
        this.props.toggleAutoThresholdIsActive();
    }

    handleThresholdChange(event) {
        this.props.setThreshold(parseFloat(event.target.value));
    }

    render() {
        const { autoThresholdIsActive, threshold } = this.props;
        return (
            <div>
                <label htmlFor='autoThresholdIsActive'>Auto Threshold</label>
                <input
                    type='checkbox'
                    name='autoThresholdIsActive'
                    checked={autoThresholdIsActive}
                    onChange={this.toggleCheckboxChange}
                />

                {!autoThresholdIsActive && <input
                    type='range'
                    name='threshold'
                    onChange={this.handleThresholdChange}
                    value={threshold}
                    min={0}
                    max={10}
                    step={0.01}
                />}
            </div>
        );
    }
}

ThresholdController.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdController);
