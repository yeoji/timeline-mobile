/**
 * Created by jq on 15/10/2016.
 */

import React, { Component } from 'react';
import { Container, Content, Button, Icon, Spinner } from 'native-base';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import TimelineAPIService from "../../services/TimelineAPIService";
import Camera from 'react-native-camera';

export default class TimelineCamera extends Component {

    constructor(props) {
        super(props);

        this.state = {
            camera: {
                aspect: Camera.constants.Aspect.fill,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto
            },
            isRecording: false
        };
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <Camera
                        ref={(cam) => {
            this.camera = cam;
          }}
                        style={styles.preview}
                        aspect={this.state.camera.aspect}
                        type={this.state.camera.type}
                        defaultTouchToFocus
                        mirrorImage={false}
                    />
                    <View style={[styles.overlay, styles.topOverlay]}>
                        <Button
                            transparent
                            style={styles.typeButton}
                            onPress={this.switchType.bind(this)}
                        >
                            <Icon name="md-reverse-camera" style={{color:'white'}}/>
                        </Button>
                    </View>

                    <View style={[styles.overlay, styles.bottomOverlay]}>
                        {
                            !this.state.isRecording
                            &&
                            <Button
                                style={styles.captureButton}
                                onPress={this.takePicture.bind(this)}
                            >
                                <Icon
                                    name="md-camera"
                                />
                            </Button>
                            ||
                            null
                        }
                    </View>
                </Content>
            </Container>
        );
    }

    switchType() {
        let newType;
        const { back, front } = Camera.constants.Type;

        if (this.state.camera.type === back) {
            newType = front;
        } else if (this.state.camera.type === front) {
            newType = back;
        }

        this.setState({
            camera: {
                ...this.state.camera,
                type: newType
            }
        });
    }

    takePicture() {
        this.camera.capture()
            .then((data) => {
                var filePath = data.path;

                var photo = {
                    uri: filePath,
                    type: 'image/jpeg',
                    name: filePath.split('/').pop()
                };

                var body = new FormData();
                body.append('Image', photo);
                body.append('MobileNo', this.props.mobileNo);

                fetch(TimelineAPIService.getUploadImageUrl(this.props.username), {
                    method: 'post',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    body: body
                }).then(response => {
                    console.log(response);
                }).catch(err => {
                    console.error(err);
                });
            })
            .catch(err => console.error(err));
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    overlay: {
        position: 'absolute',
        paddingBottom: 40,
        paddingTop: 20,
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40
    },
    typeButton: {
        padding: 5
    },
    flashButton: {
        padding: 5
    },
    buttonsSpace: {
        width: 10
    }
});

AppRegistry.registerComponent('TimelineCamera', () => TimelineCamera);