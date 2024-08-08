import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ApplicationStyles from '../Themes/ApplicationStyles'

export default function NoDataFound({ text }) {
    return (
        <View>
            <Text style={ApplicationStyles.noDataFound}>{text ? text : 'No Data Found'}</Text>
        </View>
    )
}

const styles = StyleSheet.create({

})