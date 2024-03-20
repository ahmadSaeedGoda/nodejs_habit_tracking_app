import express, { Response } from 'express';
import bodyParser from 'body-parser';
import { createHabit, getAllUserHabits, getHabitById, updateHabit, deleteHabit } from './layers/habits.service';
import { authorize } from './middleware/auth';
import { AuthRequest } from './utils/authRequest.interface';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError, ValidationError } from './errors/customErrors';
import { Validator } from './utils/validator';
import { Habit } from './entity/habit';

export const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.post('/api/v1/habits', authorize, async (req: AuthRequest, res: Response, next: Function) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: 'Request body is missing' });
      return;
    }

    const validationResult = Validator.validateHabitCreateSchema(req.body);

    if (validationResult.error) {
      throw new ValidationError('Watch the req body Bruh!', validationResult.error);
    }

    const habitToCreate = {
      user_id: req.userId,
      ...req.body
    }

    const newHabit = await createHabit(habitToCreate);

    res.status(201).json(newHabit);
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/habits', authorize, async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const habits = await getAllUserHabits(req.userId);

    res.status(200).json(habits);
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/habits/:habitId', authorize, async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const validationResult = Validator.validateGetHabitSchema(req.params);

    if (validationResult.error) {
      throw new ValidationError(
        `Watch the req Params Bruh!
        How can you imagine getting a habit with no id specified?! Are you human? 👀`,
        validationResult.error
      );
    }

    const habitId = Number(req.params.habitId);

    const habit = await getHabitById(habitId, req.userId);

    if (!habit) {
      throw new NotFoundError(
        `Record Not Found :)
        Go play somewhere else seeking vulnerable APIs you novice`
      );
    }

    res.status(200).json(habit);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/v1/habits/:habitId', authorize, async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const paramValidationResult = Validator.validateGetHabitSchema(req.params);

    if (paramValidationResult.error) {
      throw new ValidationError(
        `Are you okay? 👀 Just checking ❤️`,
        paramValidationResult.error
      );
    }

    const habitId = Number(req.params.habitId);

    const bodyValidationResult = Validator.validateHabitCreateSchema(req.body);

    if (bodyValidationResult.error) {
      throw new ValidationError(
        `Are you okay? 👀, Just checking ❤️ .. Watch the request body`,
        bodyValidationResult.error
      );
    }

    const habitToUpdate: Habit = {
      id: habitId,
      user_id: req.userId,
      ...req.body
    };

    const updatedHabit = await updateHabit(habitToUpdate);

    res.status(200).json(updatedHabit);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/v1/habits/:habitId', authorize, async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const paramValidationResult = Validator.validateGetHabitSchema(req.params);

    if (paramValidationResult.error) {
      throw new ValidationError(
        `Are you okay? 👀 Just checking ❤️`,
        paramValidationResult.error
      );
    }

    const habitId = Number(req.params.habitId);

    await deleteHabit(habitId, Number(req.userId));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Habits microservice listening on port ${port}`);
});
