/**
 * Timeline Mobile verification form
 */

import React, { Component } from 'react';
import { Container, Content, List, ListItem, InputGroup, Input, Button, Icon, Spinner } from 'native-base';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    AsyncStorage
} from 'react-native';

import TimelineAPIService from '../../services/TimelineAPIService.js';

export default class VerificationForm extends Component {

    constructor(props) {
        super(props);
        this.state = {loading: false, code: '', error: false, errorMsg: ''};
    }

    render() {

        var errorInput = (
            <List style={styles.form}>
                <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                <ListItem>
                    <InputGroup error iconRight>
                        <Icon name='ios-close-circle' style={{color:'red'}}/>
                        <Input placeholder='VERIFICATION CODE' maxLength={5} keyboardType='phone-pad'
                               onChangeText={(code) => this.setState({code})}/>
                    </InputGroup>
                </ListItem>
            </List>
        );

        var normalInput = (
            <List style={styles.form}>
                <ListItem>
                    <InputGroup>
                        <Icon name='md-keypad'/>
                        <Input placeholder='VERIFICATION CODE' maxLength={5} keyboardType='phone-pad'
                               onChangeText={(code) => this.setState({code})}/>
                    </InputGroup>
                </ListItem>
            </List>
        );

        return (
            <Container style={styles.container}>
                <Content>
                    <Text style={styles.welcome}>Verify Your Mobile Number</Text>
                    <Text style={styles.instructions}>Please enter the verification code sent to your mobile.</Text>
                    {this.state.error ? errorInput : normalInput}
                    <Button capitalize block bordered style={styles.button}
                            onPress={this.verifyCode.bind(this)}>{this.state.loading ?
                        <Spinner/> : 'Let Me In'}</Button>
                </Content>
            </Container>
        );
    }

    verifyCode() {
        this.setState({loading: true});
        TimelineAPIService.postAuthVerify(this.props.mobileNo, this.state.code)
            .then((body) => {
                if (!body.success) {
                    this.setState({error: true, errorMsg: body.message});
                } else {
                    // Save secret
                    AsyncStorage.setItem('@TimeJar:secret', body.secret)
                        .catch(function (error) {
                            // Error saving data
                            console.error(error);
                        });
                    AsyncStorage.setItem('@TimeJar:username', body.username)
                        .catch(function (error) {
                            // Error saving data
                            console.error(error);
                        });
                    AsyncStorage.setItem('@TimeJar:mobileNo', this.props.mobileNo)
                        .catch(function (error) {
                            // Error saving data
                            console.error(error);
                        });
                    // Navigate to blog
                    this.props.navigator.push({
                        id: 'Blog',
                        username: body.username,
                        mobileNo: this.props.mobileNo
                    });
                }
                this.setState({loading: false});
            })
            .catch((err) => {
                console.error(err);
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
        margin: 20
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

AppRegistry.registerComponent('VerificationForm', () => VerificationForm);