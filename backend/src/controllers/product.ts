import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/product';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

export const getProducts = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => Product.find({})
  .then((products) => res.send({
    items: products,
    total: products.length,
  }))
  .catch(next);

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Product.create(req.body)
  .then((product) => res.status(201).send({ data: product }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    }

    if (err.code === 11000) {
      return next(
        new ConflictError('Товар с таким названием уже существует'),
      );
    }

    return next(err);
  });

export const getProductById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new BadRequestError('Некорректный id товара'));
  }

  return Product.findById(id)
    .then((product) => {
      if (!product) {
        return next(new NotFoundError('Товар не найден'));
      }

      return res.send({ data: product });
    })
    .catch(next);
};
