/**
 * Created by jq on 14/10/2016.
 */

import React, { Component } from 'react';
import { Container, Content, Card, Header, Footer, FooterTab, InputGroup, Input, Title, Button, Icon, Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    AsyncStorage,
    Dimensions,
    Platform
} from 'react-native';

import BlogPost from './BlogPost';

import TimelineAPIService from '../../services/TimelineAPIService';

var ImagePicker = require('react-native-image-picker');

var options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class UserBlog extends Component {

    constructor(props) {
        super(props);
        this.state = {posts: [], loading: true, error: false, textPost: ''};

        this.retrieveBlogPosts(this);
    }

    render() {
        var posts = [];
        for (var i = 0; i < this.state.posts.length; i++) {
            var post = this.state.posts[i];
            posts.push(<BlogPost key={i} type={post.Type} content={post.Content} timestamp={post.Timestamp}/>);
        }

        return (
            <Container>
                <Header style={styles.header}>
                    <Title>{this.props.username}</Title>
                </Header>
                <Content style={styles.card}>
                    { this.state.loading ? <Spinner/> : posts}
                </Content>
                <Footer style={styles.footer}>
                    <Grid>
                        <Row size={40} style={styles.row}>
                            <InputGroup borderType='rounded' style={styles.postInput}>
                                <Icon name='ios-text' style={{ color: '#303E49'}}/>
                                <Input placeholder='Write a new text post' returnKeyLabel="Post"
                                       value={this.state.textPost}
                                       onChangeText={(textPost) => this.setState({textPost})}
                                       onSubmitEditing={this.createTextPost.bind(this)}/>
                            </InputGroup>
                        </Row>
                        <Row size={60} style={styles.row}>
                            <FooterTab>
                                <Button onPress={this.openCamera.bind(this)}>
                                    Camera
                                    <Icon name='ios-camera-outline'/>
                                </Button>
                                <Button onPress={this.openGallery.bind(this)}>
                                    Gallery
                                    <Icon name='ios-images-outline'/>
                                </Button>
                                <Button onPress={this.openVoiceRecorder.bind(this)}>
                                    Voice
                                    <Icon name='ios-microphone-outline'/>
                                </Button>
                            </FooterTab>
                        </Row>
                    </Grid>
                </Footer>
            </Container>
        );
    }

    retrieveBlogPosts(context) {
        TimelineAPIService.getUserPosts(this.props.username)
            .then(function (posts) {
                context.setState({posts: posts, loading: false});
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    createTextPost() {
        TimelineAPIService.createUserPost(this.props.mobileNo, this.props.username, 'text', this.state.textPost)
            .then((res) => {
                if (!res.success) {
                    this.setState({error: true});
                } else {
                    this.setState({textPost: ''});
                    this.retrieveBlogPosts(this);
                }
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    openVoiceRecorder() {
        this.props.navigator.push({
            id: 'Voice',
            username: this.props.username,
            mobileNo: this.props.mobileNo
        });
    }

    openCamera() {
        ImagePicker.launchCamera(options, this.processImageUpload.bind(this));
    }

    openGallery() {
        ImagePicker.launchImageLibrary(options, this.processImageUpload.bind(this));
    }

    processImageUpload(response) {
        console.log('Response = ', response);

        if (response.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (response.error) {
            console.error('ImagePicker Error: ', response.error);
        }
        else {
            const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

            fetch(TimelineAPIService.getUploadImageUrl(this.props.username), {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Image: source.uri,
                    MobileNo: this.props.mobileNo,
                    FileName: response.uri.split('/').pop()
                })
            }).then(response => {
                var res = JSON.parse(response._bodyText);
                if (res.success) {
                    this.retrieveBlogPosts(this);
                } else {
                    this.setState({error: true});
                }
            }).catch(err => {
                console.error(err);
            });
        }
    }
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    card: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        backgroundColor: '#E9F0F5'
    },
    header: {
        backgroundColor: '#303E49'
    },
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
    postInput: {
        backgroundColor: 'white',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        width: width - 40
    },
    footer: {
        backgroundColor: '#303E49',
        height: 115
    },
    row: {
        width: width
    }
});

AppRegistry.registerComponent('UserBlog', () => UserBlog);