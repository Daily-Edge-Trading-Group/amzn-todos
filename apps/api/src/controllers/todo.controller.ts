import type { NextFunction, Request, Response } from 'express'

import { NotFoundError } from '../middleware/error.middleware'
import type { CategoryRepository } from '../data/category.repository'
import type { TodoRepository } from '../data/todo.repository'

/**
 * Todo Controller
 */
export class TodoController {
  constructor(
    private todoRepo: TodoRepository,
    private categoryRepo: CategoryRepository
  ) {}

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await this.todoRepo.findAll(req.query)
      res.json({ data: todos })
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await this.todoRepo.findById(req.params.id)
      if (!todo) {
        throw new NotFoundError('Todo', req.params.id)
      }
      res.json({ data: todo })
    } catch (error) {
      next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryRepo.findById(req.body.categoryId)
      if (!category) {
        throw new NotFoundError('Category', req.body.categoryId)
      }
      const todo = await this.todoRepo.create(req.body)
      res.status(201).json({ data: todo })
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.categoryId) {
        const category = await this.categoryRepo.findById(req.body.categoryId)
        if (!category) {
          throw new NotFoundError('Category', req.body.categoryId)
        }
      }
      const todo = await this.todoRepo.update(req.params.id, req.body)
      if (!todo) {
        throw new NotFoundError('Todo', req.params.id)
      }
      res.json({ data: todo })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.todoRepo.delete(req.params.id)
      if (!deleted) {
        throw new NotFoundError('Todo', req.params.id)
      }
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
