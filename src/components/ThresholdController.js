import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const actions = require('../actions/');

const propTypes = {
    setUserThreshold: PropTypes.func.isRequired,
    toggleAutoThresholdIsActive: PropTypes.func.isRequired,
    userThreshold: PropTypes.number.isRequired,
    autoThresholdIsActive: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    userThreshold: state.onsetDetection.userThreshold,
    autoThresholdIsActive: state.onsetDetection.autoThresholdIsActive,
});

let mapDispatchToProps;
(function () {
    mapDispatchToProps = {
        setUserThreshold: actions.setThreshold,
        toggleAutoThresholdIsActive: actions.toggleAutoThresholdIsActive,
    };
})()


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
        this.props.setUserThreshold(parseFloat(event.target.value));
    }

    render() {
        const { autoThresholdIsActive, userThreshold } = this.props;
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
                    // value={threshold}
                    min={0}
                    max={2.5}
                    step={0.001}
                />}
                 <label>{userThreshold}</label>
            </div>
        );
    }
}

ThresholdController.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdController);
