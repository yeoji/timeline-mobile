/**
 * Created by jq on 15/10/2016.
 */

import React, { Component } from 'react';
import { Container, Content, Button, Icon, Spinner } from 'native-base';

import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    Dimensions,
    View
} from 'react-native';

import moment from 'moment';
import RNFS from 'react-native-fs';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

import TimelineAPIService from '../../services/TimelineAPIService';

export default class TimelineAudio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            stoppedRecording: false,
            stoppedPlaying: false,
            playing: false,
            finished: false
        };

        let audioPath = AudioUtils.DocumentDirectoryPath + '/timeline-record.aac';
        this.prepareRecordingPath(audioPath);
        AudioRecorder.onFinished = (data) => {
            this.setState({finished: data.finished});
            console.log(`Finished recording: ${data.finished}`);
        };
    }

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    render() {

        return (
            <Container style={styles.container}>
                <View style={styles.controls}>
                    {this.renderButton("RECORD", () => {
                        this.record()
                    }, this.state.recording)}
                    {this.renderButton("STOP", () => {
                        this.stop()
                    })}
                    <Text style={styles.progressText}>{(this.state.recording ? 'Recording' : 'Ready')}</Text>
                </View>
            </Container>
        );
    }

    renderButton(title, onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <Button style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </Button>
        );
    }

    stop() {
        if (this.state.recording) {
            AudioRecorder.stopRecording();
            this.setState({stoppedRecording: true, recording: false});
            // upload audio file to timeline core
            let audioPath = AudioUtils.DocumentDirectoryPath + '/timeline-record.aac';
            RNFS.readFile(audioPath, "base64")
                .then((b64) => {
                    fetch(TimelineAPIService.getUploadAudioUrl(this.props.username), {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Audio: b64,
                            MobileNo: this.props.mobileNo,
                            FileName: 'audio-' + moment().format('YYYY-MM-DD-HHmmss') + '.aac'
                        })
                    }).then(response => {
                        var res = JSON.parse(response._bodyText);
                        if (res.success) {
                            this.props.navigator.pop();
                        } else {
                            this.setState({error: true});
                        }
                    }).catch(err => {
                        console.error(err);
                    });
                })
                .catch((err) => console.error(err));

        } else if (this.state.playing) {
            AudioRecorder.stopPlaying();
            this.setState({playing: false, stoppedPlaying: true});
        }
    }

    record() {
        if (this.state.stoppedRecording) {
            let audioPath = AudioUtils.DocumentDirectoryPath + '/timeline-record.aac';
            this.prepareRecordingPath(audioPath);
        }
        AudioRecorder.startRecording();
        this.setState({recording: true, playing: false});
    }

    play() {
        if (this.state.recording) {
            this._stop();
            this.setState({recording: false});
        }
        AudioRecorder.playRecording();
        this.setState({playing: true});
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#303E49"
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    }

});

AppRegistry.registerComponent('TimelineAudio', () => TimelineAudio);