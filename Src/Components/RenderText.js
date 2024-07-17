import { StyleSheet, View, Text, Linking } from 'react-native';
import Autolink from 'react-native-autolink';


export default function RenderText({ text, style }) {
    return (
        <View style={style}>
            {/* <Text style={style}>{text}</Text> */}
            <Autolink style={style}
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
                linkStyle={{ color: 'blue', textDecorationLine: 'underline' }}
                // Optional: custom linking matchers
                // matchers={[MyCustomTextMatcher]}
                linkProps={{ suppressHighlighting: false, testID: 'link', }}
            />
        </View>
    )
}

const styles = StyleSheet.create({})