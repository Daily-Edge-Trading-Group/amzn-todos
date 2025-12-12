import type { NextFunction, Request, Response } from 'express'

import { ConflictError, NotFoundError } from '../middleware/error.middleware'
import type { CategoryRepository } from '../data/category.repository'
import type { TodoRepository } from '../data/todo.repository'

/**
 * Category Controller
 */
export class CategoryController {
  constructor(
    private categoryRepo: CategoryRepository,
    private todoRepo: TodoRepository
  ) {}

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryRepo.findAll()
      res.json({ data: categories })
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryRepo.findById(req.params.id)
      if (!category) {
        throw new NotFoundError('Category', req.params.id)
      }
      res.json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await this.categoryRepo.findByName(req.body.name)
      if (existing) {
        throw new ConflictError(`Category '${req.body.name}' already exists`)
      }
      const category = await this.categoryRepo.create(req.body)
      res.status(201).json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await this.categoryRepo.findByName(req.body.name)
      if (existing && existing.id !== req.params.id) {
        throw new ConflictError(`Category '${req.body.name}' already exists`)
      }
      const category = await this.categoryRepo.update(req.params.id, req.body)
      if (!category) {
        throw new NotFoundError('Category', req.params.id)
      }
      res.json({ data: category })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const cascade = req.query.cascade === 'true'
      const todos = await this.todoRepo.findByCategoryId(req.params.id)

      if (todos.length > 0 && !cascade) {
        throw new ConflictError(
          `Cannot delete category with ${todos.length} associated todo(s). Use cascade=true to delete them.`
        )
      }

      // Delete associated todos if cascade is enabled
      if (todos.length > 0 && cascade) {
        await this.todoRepo.deleteByCategoryId(req.params.id)
      }

      const deleted = await this.categoryRepo.delete(req.params.id)
      if (!deleted) {
        throw new NotFoundError('Category', req.params.id)
      }
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
