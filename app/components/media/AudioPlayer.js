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
    Platform,
    ActivityIndicator,
    View,
    DeviceEventEmitter
} from 'react-native';

import RCTAudio from 'react-native-player';

// Possibles states
const PLAYING = 'PLAYING';
const PAUSED = 'PAUSED';
const STOPPED = 'STOPPED';
const ERROR = 'ERROR';
const METADATA_UPDATED = 'METADATA_UPDATED';
const BUFFERING = 'BUFFERING';
const START_PREPARING = 'START_PREPARING'; // Android only
const BUFFERING_START = 'BUFFERING_START'; // Android only

export default class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: STOPPED,
            song: 'Voice Message | ' + this.props.dateTime
        };

        DeviceEventEmitter.addListener('end', () => {
            this.setState({status: STOPPED});
        });
    }

    render() {
        let icon = '';
        switch (this.state.status) {
            case PLAYING:
                icon = 'ios-pause';
                break;
            case PAUSED:
            case STOPPED:
            case ERROR:
                icon = 'ios-play';
                break;
            case BUFFERING:
            case BUFFERING_START:
            case START_PREPARING:
                icon = <Spinner/>;
                break;
        }

        return (
            <Button transparent style={styles.container} onPress={this.onPress.bind(this)}>
                <Icon name={icon} />
                <Text style={styles.songName}>{this.state.song}</Text>
            </Button>
        );
    }

    onPress() {
        switch (this.state.status) {
            case PLAYING:
                this.setState({status:PAUSED});
                RCTAudio.pause();
                break;
            case PAUSED:
                this.setState({status: PLAYING});
                RCTAudio.resume();
                break;
            case STOPPED:
                RCTAudio.prepare(this.props.url, false);
            case ERROR:
                this.setState({status: PLAYING});
                RCTAudio.start();
                break;
            case BUFFERING:
                RCTAudio.stop();
                break;
        }
    }

}

// UI
const iconSize = 60;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 80,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: '#000033',
        borderTopWidth: 1
    },
    icon: {
        color: '#000',
        fontSize: 26,
        borderColor: '#000033',
        borderWidth: 1,
        borderRadius: iconSize / 2,
        width: iconSize,
        height: Platform.os == 'ios' ? iconSize : 40,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: Platform.os == 'ios' ? 10 : 0
    },
    textContainer: {
        flexDirection: 'column',
        margin: 10
    },
    textLive: {
        color: '#000',
        marginBottom: 5
    },
    songName: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000'
    }
});

AppRegistry.registerComponent('AudioPlayer', () => AudioPlayer);