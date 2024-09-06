import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'

export default function TagUserModal({ text }) {
    const { user, groupCreateAllUsers } = useSelector(e => e.common)

    console.log(groupCreateAllUsers.length)

    return (
        <View>
            <Text>TagUserModal</Text>
        </View>
    )
}

const styles = StyleSheet.create({})