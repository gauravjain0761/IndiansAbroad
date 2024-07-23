import { useState } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import Autolink from 'react-native-autolink';
import colors from '../Themes/Colors';
import { FontStyle } from '../utils/commonFunction';

export default function RenderText({ text, style, showReadMore }) {
    const [showMore, setshowMore] = useState(false)
    return (
        <View style={style}>
            {/* <Text style={style}>{text}</Text> */}
            <Autolink style={[style, { marginHorizontal: 0, paddingHorizontal: 0 }]}
                // Required: the text to parse for links
                text={text}
                // Optional: enable email linking
                email={true}
                // Optional: enable hashtag linking to instagram
                // hashtag="instagram"
                // Optional: enable @username linking to twitter
                // mention="twitter"
                // Optional: enable phone linking
                phone={true}
                // Optional: enable URL linking
                // url={true}
                renderLink={(text, match) => {
                    return (
                        <Text onPress={() => Linking.openURL(match.matchedText)} style={[style, { color: 'blue', textDecorationLine: 'underline' }]}>{match.matchedText}</Text>
                    )
                }}
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
                linkStyle={{ color: 'blue', textDecorationLine: 'underline' }}
                // Optional: custom linking matchers
                // matchers={[MyCustomTextMatcher]}
                linkProps={{ suppressHighlighting: false, testID: 'link', }}
            />
        </View>
    )
}

const styles = StyleSheet.create({})