/**
 * Timeline Mobile log in form
 */

import React, { Component } from 'react';
import { Container, Content, List, ListItem, InputGroup, Input, Button, Icon, Spinner } from 'native-base';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

import TimelineAPIService from '../../services/TimelineAPIService.js';

export default class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {mobileNo: '+61', error: false, errorMsg: '', loading: false};
    }

    render() {
        var errorInput = (
            <List style={styles.form}>
                <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                <ListItem>
                    <InputGroup error iconRight>
                        <Icon name='ios-close-circle' style={{color:'red'}}/>
                        <Input placeholder='MOBILE NO (+61)' maxLength={12} keyboardType='phone-pad'
                               value={this.state.mobileNo} onChangeText={this.checkMobileNo.bind(this)}/>
                    </InputGroup>
                </ListItem>
            </List>
        );

        var normalInput = (
            <List style={styles.form}>
                <ListItem>
                    <InputGroup>
                        <Icon name='ios-phone-portrait'/>
                        <Input placeholder='MOBILE NO (+61)' maxLength={12} keyboardType='phone-pad'
                               value={this.state.mobileNo}
                               onChangeText={this.checkMobileNo.bind(this)}/>
                    </InputGroup>
                </ListItem>
            </List>
        );

        return (
            <Container style={styles.container}>
                <Content>
                    <Text style={styles.welcome}>Welcome to TimeJar Mobile!</Text>
                    <Text style={styles.instructions}>Please log in to your TimeJar.</Text>
                    {this.state.error ? errorInput : normalInput}
                    <Button capitalize block bordered style={styles.button}
                            onPress={this.logIn.bind(this)}>{this.state.loading ? <Spinner/> : 'Log In'}</Button>
                    <Button block transparent style={styles.button} onPress={this.switchRegister.bind(this)}>Not yet
                        registered? Click here!</Button>
                </Content>
            </Container>
        );
    }

    checkMobileNo(mobileNo) {
        if (!mobileNo.startsWith("+61")) {
            this.setState({mobileNo: '+61'});
        } else {
            this.setState({mobileNo});
        }
    }

    /**
     * Sends the mobile no to the Timeline Mobile core
     * So a verification code can be sent to the user
     */
    logIn() {
        this.setState({loading: true});
        TimelineAPIService.postAuthLogin(this.state.mobileNo)
            .then((body) => {
                if (!body.success) {
                    this.setState({error: true, errorMsg: body.message});
                } else {
                    // Navigate to blog
                    this.props.navigator.push({
                        id: 'Verify',
                        mobileNo: this.state.mobileNo
                    });
                }
                this.setState({loading: false});
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * Switch to register form
     */
    switchRegister() {
        this.props.navigator.push({
            id: 'Register',
            mobileNo: this.state.mobileNo
        });
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    button: {
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10
    },
    form: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 100,
        marginBottom: 100
    },
    errorMsg: {
        color: 'red',
        textAlign: 'center'
    }
});

AppRegistry.registerComponent('LoginForm', () => LoginForm);