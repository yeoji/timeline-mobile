/**
 * Created by jq on 14/10/2016.
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

export default class RegisterForm extends Component {

    constructor(props) {
        super(props);
        this.state = {mobileNo: props.mobileNo, username: '', error: false, errorMsg: '', loading: false};
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
                <ListItem>
                    <InputGroup error iconRight>
                        <Icon name='ios-close-circle' style={{color:'red'}}/>
                        <Input placeholder='USERNAME'
                               onChangeText={(username) => this.setState({username})}/>
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
                <ListItem>
                    <InputGroup>
                        <Icon name='md-person'/>
                        <Input placeholder='USERNAME'
                               onChangeText={(username) => this.setState({username})}/>
                    </InputGroup>
                </ListItem>
            </List>
        );

        return (
            <Container style={styles.container}>
                <Content>
                    <Text style={styles.welcome}>Welcome to TimeJar Mobile!</Text>
                    <Text style={styles.instructions}>Please register for your TimeJar.</Text>
                    {this.state.error ? errorInput : normalInput}
                    <Button capitalize block bordered style={styles.button}
                            onPress={this.register.bind(this)}>{this.state.loading ? <Spinner/> : 'Register'}</Button>
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

    register() {
        this.setState({loading: true});
        TimelineAPIService.postAuthRegister(this.state.mobileNo, this.state.username)
            .then((body) => {
                if (!body.success) {
                    this.setState({error: true, errorMsg: body.message});
                } else {
                    // Navigate to verify
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

AppRegistry.registerComponent('RegisterForm', () => RegisterForm);