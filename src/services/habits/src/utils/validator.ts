import Joi from 'joi';
import { Habit } from '../entity/habit';
import { ParamsDictionary } from 'express-serve-static-core';

export class Validator {
  private static createHabitSchema = Joi.object<Habit>({
    title: Joi.string().required(),
    description: Joi.string().optional().allow(''),
  });

  private static getHabitSchema = Joi.object<{ habitId: number }>({
    habitId: Joi.number().required().min(1),
  });

  static validateHabitCreateSchema(habit: Habit): Joi.ValidationResult {
    return this.createHabitSchema.validate(habit, { abortEarly: false });
  }

  static validateGetHabitSchema(params: Partial<ParamsDictionary>): Joi.ValidationResult {
    return this.getHabitSchema.validate(params, { abortEarly: false });
  }
}
