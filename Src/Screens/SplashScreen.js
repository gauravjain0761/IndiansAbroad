import { FlatListComponent, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native';
import colors from '../Themes/Colors';
import { SCREEN_WIDTH } from '../Themes/Fonts';
import { resetNavigation } from '../utils/Global';
import { screenName } from '../Navigation/ScreenConstants';
import { getAsyncToken, getAsyncUserInfo } from '../utils/AsyncStorage';
import { dispatchAction, setAuthorization } from '../utils/apiGlobal';
import { SET_USER } from '../Redux/ActionTypes';
import { onGetUserInfoApi, oncheckSession } from '../Services/AuthServices';
import { useDispatch } from 'react-redux';
import Loader from '../Components/Loader';
import { useNavigation } from '@react-navigation/native';
export default function SplashScreen() {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        setTimeout(() => {
            setloading(true)
            checkSession()
        }, 3000);

    }, [])

    const checkSession = async () => {
        let token = await getAsyncToken()
        console.log(token)
        if (token) {
            let obj = {
                params: {
                    token: token
                },
                onSuccess: async (response) => {
                    await setAuthorization(token)
                    let user = await getAsyncUserInfo()
                    console.log('user--', user)
                    dispatchAction(dispatch, SET_USER, user)
                    if (user && user._id) {
                        dispatch(onGetUserInfoApi({
                            params: {
                                userId: user._id
                            },
                            onSuccess: () => {
                                setloading(false)
                                if (user?.step == 0) {
                                    navigation.navigate(screenName.CompleteProfile)
                                } else if (user?.step == 1) {
                                    navigation.navigate(screenName.CompleteProfile2)
                                } else {
                                    resetNavigation('Home')
                                }
                            }
                        }))
                    } else {
                        doLogin()
                    }
                },
                onFailure: (error) => {
                    doLogin()
                }
            }
            dispatch(oncheckSession(obj))
        } else {
            doLogin()
        }
    }

    const doLogin = () => {
        setloading(false)
        resetNavigation(screenName.LoginScreen)
    }

    return (
        <View style={styles.container}>
            {loading ?
                <Loader />
                :
                <Image
                    source={require('../assets/Icons/Logo_Transition.gif')}
                    style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH, resizeMode: 'contain' }}
                />
                // <LottieView
                //     source={require('../assets/Icons/Logo_Transition.json')}
                //     speed={2}
                //     // autoPlay
                //     loop={FlatListComponent}
                //     style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH, backgroundColor: 'red' }}
                // />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    }
})