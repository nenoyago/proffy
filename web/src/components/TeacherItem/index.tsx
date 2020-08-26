import React, { useMemo } from 'react'

import api from '../../services/api'

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'

import './styles.css'

export interface Teacher {
  id: number
  avatar: string
  bio: string
  cost: number
  name: string
  subject: string
  whatsapp: string
}

interface TeacherItemProps {
  teacher: Teacher
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher }) => {

  const cost = useMemo(() => teacher.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), [teacher.cost])

  async function createNewConnection() {
    try {
      await api.post('connections', {
        user_id: teacher.id
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <article className="teacher-item">
      <header>
        <img
          src={teacher.avatar}
          alt={teacher.name} />
        <div>
          <strong>{teacher.name}</strong>
          <span>{teacher.subject}</span>
        </div>
      </header>
      <p>{teacher.bio}</p>

      <footer>
        <p>
          Preco/hora
        <strong>
            {cost}
          </strong>
        </p>
        <a target="_blank"
          onClick={createNewConnection}
          href={`https://wa.me/${teacher.whatsapp}`} >
          <img src={whatsappIcon} alt="Whatsapp" />
        Entrar em contato
      </a>
      </footer>
    </article>
  )
}

export default TeacherItem