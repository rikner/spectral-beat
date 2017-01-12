import React, { Component } from 'react';
import Button from '/client/components/Button';
import { startAudioProcessing, stopAudioProcessing } from '/client/lib/audio';

class ControlPanel extends Component {
    render() {
        return (
            <div>
                <Button
                    label='Start'
                    onClick={startAudioProcessing}
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

export default ControlPanel;
