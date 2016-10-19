/**
 * Created by jq on 14/10/2016.
 */

import React, { Component } from 'react';
import { Card, CardItem, Icon, Spinner } from 'native-base';

import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    Dimensions,
    Image,
    View
} from 'react-native';

import moment from 'moment';

import { Player } from 'react-native-audio-streaming';
import AudioPlayer from '../media/AudioPlayer';

export default class BlogPost extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var item = '';
        switch (this.props.type) {
            case 'text':
                item = (
                    <View style={styles.viewItem}>
                        <CardItem>
                            <Text style={styles.textPost}>
                                {this.props.content}
                            </Text>
                        </CardItem>
                        <CardItem header style={styles.footer}>
                            <Text
                                style={{textAlign: 'center'}}>{moment(this.props.timestamp).utcOffset(10).format("MMM D, h:mm A")}</Text>
                        </CardItem>
                    </View>
                );
                break;
            case 'image':
                item = (
                    <View style={styles.viewItem}>
                        <CardItem>
                            <Image style={styles.imagePost} source={{uri: this.props.content}}/>
                        </CardItem>

                        <CardItem header style={styles.footer}>
                            <Text
                                style={{textAlign: 'center'}}>{moment(this.props.timestamp).utcOffset(10).format("MMM D, h:mm A")}</Text>
                        </CardItem>
                    </View>
                );
                break;
            case 'audio':
                var time = moment(this.props.timestamp).utcOffset(10).format("MMM D, h:mm A");
                item = (
                    <View style={styles.viewItem}>
                        <CardItem>
                            <AudioPlayer url={this.props.content} dateTime={time}/>
                        </CardItem>
                    </View>
                );
                break;
        }

        return item;
    }
}

var styles = StyleSheet.create({
    viewItem: {
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#d7e4ed',
        backgroundColor: 'white'
    },
    cardItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        backgroundColor: 'white'
    },
    textPost: {
        fontSize: 18,
        textAlign: 'center'
    },
    imagePost: {
        resizeMode: 'center',
        width: null,
        borderWidth: 15
    },
    footer: {
        backgroundColor: '#d7e4ed',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    }
});

AppRegistry.registerComponent('BlogPost', () => BlogPost);