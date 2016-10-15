/**
 * Timeline Mobile App
 */

import React, { Component } from 'react';
import { Container, Content } from 'native-base';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    BackAndroid,
    AsyncStorage
} from 'react-native';

import LoginForm from './app/components/auth/LoginForm.js';
import VerificationForm from './app/components/auth/VerificationForm.js';
import RegisterForm from './app/components/auth/RegisterForm.js';
import UserBlog from './app/components/blog/UserBlog.js';
import TimelineCamera from './app/components/media/TimelineCamera.js';
import TimelineGallery from './app/components/media/TimelineGallery.js';
import TimelineAudio from './app/components/media/TimelineAudio.js';

var _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator.getCurrentRoutes().length === 1  ) {
        return false;
    }
    _navigator.pop();
    return true;
});

class TimelineMobile extends Component {
    render() {
        AsyncStorage.multiGet(['@TimeJar:username', '@TimeJar:mobileNo'])
            .then(function(data) {
                if(data != null) {
                    _navigator.push({
                        id: 'Blog',
                        username: data[0][1],
                        mobileNo: data[1][1]
                    });
                }
            });

        return (
            <Navigator style={{flex:1}} initialRoute={{id: 'LogIn'}} renderScene={this.renderScene}/>
        );
    }

    renderScene(route, navigator) {
        _navigator = navigator;
        switch (route.id) {
            case 'LogIn':
                return (
                    <LoginForm navigator={navigator}/>
                );
            case 'Verify':
                return <VerificationForm navigator={navigator} mobileNo={route.mobileNo}/>;
            case 'Register':
                return <RegisterForm navigator={navigator} mobileNo={route.mobileNo}/>;
            case 'Blog':
                return <UserBlog navigator={navigator} username={route.username} mobileNo={route.mobileNo}/>;
            case 'Camera':
                return <TimelineCamera navigator={navigator} username={route.username} mobileNo={route.mobileNo}/>;
            case 'Gallery':
                return <TimelineGallery navigator={navigator}/>;
            case 'Voice':
                return <TimelineAudio navigator={navigator} username={route.username} mobileNo={route.mobileNo}/>;
        }
    }
}

AppRegistry.registerComponent('TimelineMobile', () => TimelineMobile);
