import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles'

export default function NoDataFound() {
    return (
        <View>
            <Text style={ApplicationStyles.noDataFound}>No Data Found</Text>
        </View>
    )
}

const styles = StyleSheet.create({

})