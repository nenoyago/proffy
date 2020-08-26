import { Request, Response } from 'express'
import db from '../database/connection'

export default class ConnectionControllers {
  async index(request: Request, response: Response) {
    try {
      const totalConnections = await db('connections').count('* as total')

      const { total } = totalConnections[0]

      return response.status(200).json({ total })
    } catch (err) {
      return response.status(400).json({
        error: 'An unexpected error has occurred, please try again.'
      })
    }
  }

  async create(request: Request, response: Response) {
    const { user_id } = request.body

    try {
      await db('connections').insert({
        user_id
      })

      return response.status(201).send()
    } catch (err) {
      return response.status(400).json({
        error: 'An unexpected error has occurred, please try again.'
      })
    }

  }
}