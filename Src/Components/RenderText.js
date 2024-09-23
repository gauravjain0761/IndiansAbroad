import { useState } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import Autolink from 'react-native-autolink';
import colors from '../Themes/Colors';
import { FontStyle } from '../utils/commonFunction';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../Navigation/ScreenConstants';
import { useSelector } from 'react-redux';

export default function RenderText({ text, style, showReadMore, numberOfLines = undefined }) {
    const [showMore, setshowMore] = useState(false)
    const navigation = useNavigation()
    const { user, activeChatRoomUser, groupCreateAllUsers } = useSelector(e => e.common)

    // console.log(text)
    return (
        <View style={style}>
            {/* <Text style={style}>{text}</Text> */}
            <Autolink style={[style, { marginHorizontal: 0, paddingHorizontal: 0 }]}
                // Required: the text to parse for links
                text={text}
                numberOfLines={numberOfLines}
                // Optional: enable email linking
                email={true}
                // Optional: enable hashtag linking to instagram
                // hashtag="instagram"
                // Optional: enable @username linking to twitter
                // mention="twitter"
                matchers={[
                    // {
                    //     pattern: /@\[([^[]*)]\(([^(^)]*)\)/g,
                    //     style: { ...style, fontFamily: 'OpenSans-Bold' },
                    //     getLinkText: (replacerArgs) => `@${replacerArgs[1]}`,
                    //     onPress: (match) => {
                    //         navigation.navigate(screenName.indiansDetails, { userId: match.getReplacerArgs()[2] });
                    //         // navigation.navigate('userProfile', { userId: match.getReplacerArgs()[2] });
                    //     },
                    // },
                    {
                        pattern: /(?<=\s|^\s?)@[A-z0-9]+(?=\s|\s?$)/g,
                        style: { ...style, fontFamily: 'OpenSans-Bold' },
                        getLinkText: (replacerArgs) => replacerArgs[0].replace('@', '') == user?._id ? `@${user?.first_Name} ${user?.last_Name}` : groupCreateAllUsers ? `@${groupCreateAllUsers.filter(obj => obj._id == replacerArgs[0].replace('@', ''))[0]?.first_Name} ${groupCreateAllUsers.filter(obj => obj._id == replacerArgs[0].replace('@', ''))[0]?.last_Name}` : '',
                        onPress: (match) => {
                            if (match.matchedText.replace('@', '') !== user?._id) {
                                navigation.navigate(screenName.indiansDetails, { userId: match.matchedText.replace('@', '') });
                            } else {
                                navigation.navigate(screenName.profileScreen)
                            }
                        },
                    },
                ]}
                // Optional: enable phone linking
                phone={true}
                // Optional: enable URL linking
                // url={false}
                // url={{ tldMatches: true }}
                linkStyle={{ ...style, color: 'blue', textDecorationLine: 'underline' }}
                // linkProps={{ suppressHighlighting: false, testID: 'link', }}
                // renderLink={(text, match) => {
                //     return (
                //         <Text onPress={() => Linking.openURL(match.matchedText)} style={[style, { color: 'blue', textDecorationLine: 'underline' }]}>{match.matchedText}</Text>
                //     )
                // }}
                renderText={(text, match) => {
                    if (showReadMore) {
                        if (text.length > 120 && !showMore) {
                            return (
                                <Text style={[style]}>{text.substring(0, 120)} ...<Text onPress={() => setshowMore(true)} style={{ color: colors.primary_500 }}>Read More</Text></Text>
                            )
                        } else
                            if (text.length > 120) {
                                return (
                                    <Text style={[style]}>{text} <Text onPress={() => setshowMore(false)} style={{ color: colors.primary_500 }}>Read Less</Text></Text>
                                )
                            } else {
                                return (
                                    <Text style={[style]}>{text}</Text>
                                )
                            }
                    } else {
                        return (
                            <Text style={[style]}>{text}</Text>
                        )
                    }

                }}

            />
        </View>
    )
}

const styles = StyleSheet.create({})