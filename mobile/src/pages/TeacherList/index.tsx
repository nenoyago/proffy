import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

import AsyncStorage from '@react-native-community/async-storage'

import api from '../../services/api'

import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'


import styles from './styles'


const TeacherList = () => {
  const [isFiltersVisitble, setIsFiltersVisitble] = useState(false)
  const [teachers, setTeachers] = useState([])
  const [favorites, setFavorites] = useState<number[]>([])

  const [subject, setSubject] = useState('')
  const [weekDay, setWeekDay] = useState('')
  const [time, setTime] = useState('')

  async function loadFavorites() {
    try {
      const response = await AsyncStorage.getItem('@proffy:favorites')
      if (response) {
        const favoritedTeachers = JSON.parse(response)

        const favoritedTeachersIds = favoritedTeachers
          .map((teacher: Teacher) => teacher.id)

        setFavorites(favoritedTeachersIds)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useFocusEffect(() => {
    loadFavorites()
  })

  function handleToggleFiltersVisible() {
    setIsFiltersVisitble(!isFiltersVisitble)
  }

  async function handleFiltersSubmit() {
    loadFavorites()

    try {
      const response = await api.get('classes', {
        params: {
          subject,
          week_day: weekDay,
          time
        }
      })
      setIsFiltersVisitble(false)
      setTeachers(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponiveis"
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#FFF" />
          </BorderlessButton>
        )
        }
      >

        {isFiltersVisitble && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Materia</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={text => setSubject(text)}
              placeholder="Qual a materia?"
              placeholderTextColor="#C1BCCC"
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  value={weekDay}
                  onChangeText={text => setWeekDay(text)}
                  placeholder="Qual o dia?"
                  placeholderTextColor="#C1BCCC"
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horario</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={text => setTime(text)}
                  placeholder="Qual horario?"
                  placeholderTextColor="#C1BCCC"
                />
              </View>
            </View>

            <RectButton
              style={styles.submitButton}
              onPress={handleFiltersSubmit}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        scrollEnabled={teachers.length > 0}
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher: Teacher) => (
          <TeacherItem
            key={teacher.id}
            teacher={teacher}
            favorited={favorites.includes(teacher.id)}
          />)
        )}
      </ScrollView>

    </View>
  )
}

export default TeacherList