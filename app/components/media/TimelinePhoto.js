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
    Platform
} from 'react-native';

var ImagePicker = require('react-native-image-picker');

// More info on all the options is below in the README...just some common use cases shown here
var options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class TimelinePhoto extends Component {

}

AppRegistry.registerComponent('TimelinePhoto', () => TimelinePhoto);