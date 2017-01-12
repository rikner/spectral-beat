import React, { Component } from 'react';
import Button from '/client/components/Button';
import { startAudioProcessing, stopAudioProcessing } from '/client/lib/audio';
import { connect } from 'react-redux';
import settingsActions from '/client/actions/actionCreators';

class ControlPanel extends Component {
    render() {
        const { setCanvasColor } = this.props;
        return (
            <div>
                <Button
                    label='Start'
                    onClick={() => {
                        startAudioProcessing(() => {
                            setCanvasColor(getRandomColor());
                        });
                    }}
                />
                <Button
                    label='Stop'
                    onClick={stopAudioProcessing}
                />
                <Button
                    label='Settings'
                    onClick={() => {}}
                />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCanvasColor: (color) => {
            dispatch(settingsActions.setCanvasColor(color));
        },
    };
};

export default connect(null, mapDispatchToProps)(ControlPanel);


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}