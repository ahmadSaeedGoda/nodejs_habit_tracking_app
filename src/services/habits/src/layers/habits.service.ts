import { DeleteResult, UpdateResult } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Habit } from '../entity/habit';
import { NotFoundError, ValidationError } from '../errors/customErrors';

const habitRepository = AppDataSource.getRepository(Habit);

export const createHabit: Function = async (habit: Habit): Promise<Habit> => {
  const existHabit = await habitRepository.findOne({
    where: {
      user_id: habit.user_id,
      title: habit.title,
    }
  });

  if (existHabit) {
    throw new ValidationError('A Habit already exist with the provided title for the current user');
  }

  return await habitRepository.save(habit);
};

export const getAllUserHabits: Function = async (userId: number): Promise<Habit[]> => {
  return await habitRepository.find({
    where: {
      user_id: userId,
    }
  });
};

export const getHabitById: Function = async (id: number, user_id: number): Promise<Habit | null> => {
  return await habitRepository.findOne({ where: { id, user_id } });
  // better to get by id to throw notfound if not, then get by userId to throw unauthorized if not
  // however, i find this acceptable & i like it for non production task-based practice
};

export const updateHabit: Function = async (updatedHabit: Partial<Habit>): Promise<Habit> => {
  const existHabit = await habitRepository.findOne({
    where: {
      id: updatedHabit.id,
      user_id: updatedHabit.user_id,
    }
  });

  if(!existHabit) throw new NotFoundError(`Habit Not Found`);

  existHabit.title = updatedHabit.title;
  existHabit.description = updatedHabit.description || "";
  return await habitRepository.save(existHabit)
};

export const deleteHabit: Function = async (habitId: number, user_id: number): Promise<DeleteResult> => {
  const existHabit = await habitRepository.findOne({
    where: {
      id: habitId,
      user_id: user_id,
    }
  });

  if(!existHabit) throw new NotFoundError(`Habit Not Found`);

  return await habitRepository.delete(habitId);
};
