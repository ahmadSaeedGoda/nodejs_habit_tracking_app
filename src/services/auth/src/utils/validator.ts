import Joi from 'joi';
import { User } from '../entity/auth.model';

export class Validator {
  private static userSchema = Joi.object<User>({
    name: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  private static userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  static validateUser(user: User): Joi.ValidationResult {
    return this.userSchema.validate(user, { abortEarly: false });
  }

  static validateLoginCreds(user: any): Joi.ValidationResult {
    return this.userLoginSchema.validate(user, { abortEarly: false });
  }
}
