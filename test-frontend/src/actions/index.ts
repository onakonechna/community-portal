import { action } from 'typesafe-actions';

export const ADD = 'TEST_TYPE';

export const add = (amount: number) => action(ADD, amount);