import React, { useState, useCallback } from 'react'
import { ScrollView, AsyncStorage, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'

import styles from './styles'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])

  const loadFavorites = useCallback(async () => {
    try {
      const response = await AsyncStorage.getItem('@proffy:favorites')
      if (response) {
        const favoritedTeachers = JSON.parse(response)

        setFavorites(favoritedTeachers)
      }
    } catch (err) {
      console.log(err)
    }
  }, [])

  useFocusEffect(() => {
    loadFavorites()
  })

  return (
    <View style={styles.container}>
      <PageHeader title="Proffys disponiveis" />

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {favorites.length > 0 && favorites.map((teacher: Teacher) => (
          <TeacherItem key={teacher.id} teacher={teacher} favorited />
        ))}
      </ScrollView>
    </View>
  )
}

export default Favorites