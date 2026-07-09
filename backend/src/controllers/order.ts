import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

interface OrderBody {
  items: string[];
  total: number;
}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total }: OrderBody = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('Корзина не может быть пустой'));
    }

    const isValidIds = items.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!isValidIds) {
      return next(new BadRequestError('Некорректный id товара'));
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Передан несуществующий товар'));
    }

    const hasUnavailableProduct = products.some((product) => product.price === null);
    if (hasUnavailableProduct) {
      return next(new BadRequestError('Один или несколько товаров недоступны для покупки'));
    }

    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price as number),
      0,
    );

    if (calculatedTotal !== total) {
      return next(new BadRequestError('Некорректная сумма заказа'));
    }

    return res.send({
      id: faker.string.uuid(),
      total,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Некорректный id товара'));
    }

    return next(err);
  }
};

export default createOrder;
