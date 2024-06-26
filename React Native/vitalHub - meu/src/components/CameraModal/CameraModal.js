import { Camera, CameraType } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'


export default function CameraModal({
    navigation,
    visible,
    setShowCamera,
    setPhotoUpload,
    ...rest
}) {
    const cameraRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [tipoCamera, setTipoCamera] = useState(CameraType.front);

    /*
    DESAFIOS
    1 - Quando salvar a foto e clicar na lixeira - remover a galeria.
    2 - Permitir a foto com flash.
    3 - Botão para recarregar o autofocus.
    4 - Capturar e salvar vídeos.
    */

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();

            const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        })()
    }, []);

    async function CapturePhoto() {
        if (cameraRef) {
            const photo = await cameraRef.current.takePictureAsync();

            setPhoto(photo.uri);

            setOpenModal(true);

            console.log(photo);
        }
    }

    function UploadPhoto() {
        setPhotoUpload(photo);

        setOpenModal(false);
        setShowCamera(false);
    }

    function ClearPhoto() {
        setPhoto(null)

        setOpenModal(false)
    }

    return (
        // modal
        <Modal {...rest} visible={visible} transparent={true} animationType='fade'>
            {/* container inteiro */}
            <View style={styles.container}>
                {/* camera */}
                <Camera
                    ref={cameraRef}
                    style={styles.camera}
                    type={tipoCamera}
                    ratio='16:9'
                >
                    <View style={styles.viewFlip}>

                    </View>
                </Camera>

                <View style={styles.bottom}>
                    {/* retornar */}
                    <TouchableOpacity
                        style={styles.btnReturn}
                        onPress={() => setShowCamera(false)}>
                        <MaterialCommunityIcons name="keyboard-return" size={24} color="#FFF" />
                    </TouchableOpacity>

                    {/* tirar foto */}
                    <TouchableOpacity
                        style={styles.btnCapture}
                        onPress={() => CapturePhoto()}
                    >
                        <FontAwesome name='camera' size={23} color={"#FFF"} />
                    </TouchableOpacity>

                    {/* trocar câmera */}
                    <TouchableOpacity
                        style={styles.btnSwitch}
                        onPress={() => setTipoCamera(tipoCamera == CameraType.front ?
                            CameraType.back :
                            CameraType.front
                        )}
                    >
                        <MaterialIcons name="cameraswitch" size={24} color="#FFF" />
                    </TouchableOpacity>

                </View>



                <Modal animationType='slide' transparent={false} visible={openModal}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 20
                    }}>
                        <View style={{
                            margin: 10,
                            flexDirection: 'row'
                        }}>
                            {/* botões de controle */}
                            <TouchableOpacity style={styles.btnClear} onPress={() => ClearPhoto()}>
                                <FontAwesome name='trash' size={45} color={"#FF0000"} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnUpload} onPress={() => UploadPhoto()}>
                                <FontAwesome name='upload' size={35} color={"#121212"} />
                            </TouchableOpacity>
                        </View>

                        <Image
                            style={{
                                width: '100%',
                                height: 500,
                                borderRadius: 15,
                            }}
                            source={{ uri: photo }}
                        />

                    </View>
                </Modal>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottom: {
        flexDirection: 'row',

    },

    camera: {
        flex: 1,
        width: '100%',
        height: '80%',
    },

    viewFlip: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'center'
    },

    btnFlip: {
        padding: 20,
    },

    txtFlip: {
        fontSize: 20,
        color: '#FFF',
        marginBottom: 20,
    },

    btnCapture: {
        padding: 20,
        margin: 20,
        borderRadius: 20,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignContent: 'center',
    },

    btnClear: {
        padding: 20,
        backgroundColor: 'center',

        justifyContent: 'center',
        alignItems: 'center',
    },

    btnUpload: {
        padding: 20,
        backgroundColor: 'transparent',

        justifyContent: 'center',
        alignItems: 'center',
    },

    btnReturn: {
        padding: 20,
        margin: 20,
        borderRadius: 20,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignContent: 'center',
    },

    btnSwitch: {
        padding: 20,
        margin: 20,
        borderRadius: 20,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignContent: 'center',
    }
});
