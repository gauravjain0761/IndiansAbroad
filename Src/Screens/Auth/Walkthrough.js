import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { Icons } from '../../Themes/Icons'
import colors from '../../Themes/Colors'
import { FontStyle } from '../../utils/commonFunction'
import { SCREEN_WIDTH, fontname, wp } from '../../Themes/Fonts'
import CommonButton from '../../Components/CommonButton'
import { useNavigation } from '@react-navigation/native'
import { screenName } from '../../Navigation/ScreenConstants'
import Header from '../../Components/Header'
import PagerView from 'react-native-pager-view';
import { resetNavigation } from '../../utils/Global'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
export default function Walkthrough() {
    let data = [
        { title: 'Showcase your profile', des: 'Showcase your profile to stand out in the community and connect easily, fostering meaningful connections and networking opportunities among Indian expats.', image: Icons.w_1 },
        { title: 'Share your abroad journey', des: "Share your abroad journey, stories, insights, or travel glimpses on your feed. Engage with the community by posting content and discovering others' experiences.", image: Icons.w_2 },
        { title: 'Build network with customized search', des: 'Make personal and professional connections. A customized search tool allows you to find any person by their name, city, country, university, profession or company.', image: Icons.w_3 },
        { title: 'Private & group chat', des: 'Engage in private one-on-one conversations and join or create group chats based on your interests and location.', image: Icons.w_4 },
        { title: 'Create pages', des: 'Connect or create to pages for your local Indian community, association, alumni group, consultancy, company, organization or any other interest group, making it easier than ever to stay connected and support one another.', image: Icons.w_5 },
        { title: 'World & country specific discussion forums', des: 'Ask questions & queries, share experiences, seek advice and exchange ideas. Worldwide and country specific forums allow you to discuss various topics without being overwhelmed by numerous irrelevant threads.', image: Icons.w_6 },
        { title: 'Find & list events', des: 'List your event, attendees register seamlessly, and event fees are securely transferred directly to your bank account. No more manual entry hassles - enjoy a smoother experience for both organizers and attendees.', image: Icons.w_7 },
    ]
    const [page, setpage] = useState(0)
    const PagerViewRef = useRef(null)
    const navigation = useNavigation()
    const insets = useSafeAreaInsets();
    return (
        <View style={ApplicationStyles.applicationView}>
            {/* <ImageBackground style={ApplicationStyles.flex} source={Icons.loginBg}> */}
            <SafeAreaView style={ApplicationStyles.flex}>
                <View style={[styles.headerPosition, { top: insets.top }]}>
                    <Header showLeft logoShow={false} />
                </View>
                <PagerView ref={PagerViewRef} onPageSelected={e => { setpage(e.nativeEvent.position) }} style={[ApplicationStyles.flex, { marginTop: wp(40) }]} initialPage={0}>
                    {data.map((item, index) => {
                        return (
                            <View key={index} style={[ApplicationStyles.flex]}>
                                {/* <View style={{ marginBottom: 20 }}> */}
                                <Image source={item.image} style={{ width: SCREEN_WIDTH, height: '70%', resizeMode: 'contain', marginBottom: 10 }} />
                                {/* </View> */}
                                <Text style={{ ...FontStyle(18, colors.neutral_900, '700'), marginHorizontal: wp(10), marginBottom: 10, textAlign: 'center' }}>{item.title}</Text>
                                <Text style={{ ...FontStyle(14, colors.neutral_900), marginHorizontal: wp(12), lineHeight: 22, textAlign: 'center' }}>{item.des}</Text>
                            </View>
                        )
                    })}
                </PagerView>
                {page < data.length - 1 ?
                    <View style={{
                        flexDirection: 'row', alignSelf: 'center',
                        marginBottom: 10,
                        gap: 5
                    }}>
                        {data.map((item, index) => {
                            return (
                                <View style={{
                                    height: 10, width: 10,
                                    backgroundColor: page == index ? colors.neutral_900 : colors.neutral_400,
                                    borderRadius: 10 / 2,

                                }} />
                            )
                        })}
                    </View>

                    // <TouchableOpacity onPress={() => PagerViewRef.current.setPage(page + 1)} >
                    //     <Image source={Icons.Arrow_circle_right} style={styles.rightIcon} />
                    // </TouchableOpacity>
                    :

                    <CommonButton title={'Explore'} onPress={() => resetNavigation('Home')} extraStyle={{ marginBottom: 10, marginHorizontal: 10 }} />

                    // : <CommonButton title={'Explore'} onPress={() => navigation.navigate(screenName.PaymentModalScreen)} extraStyle={{ marginBottom: 10, marginHorizontal: 10 }} />
                }
            </SafeAreaView>
            {/* </ImageBackground> */}
        </View>
    )
}

const styles = StyleSheet.create({
    rightIcon: {
        width: 50,
        height: 50,
        tintColor: colors.neutral_900,
        marginBottom: 10,
        alignSelf: 'center'
    },
    headerPosition: {
        position: 'absolute',
        top: 0
    }
})