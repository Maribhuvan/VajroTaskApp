import { combineReducers } from 'redux';

import menu from './menu';
import tasks from './tasks';
import users from './users';

const reducers = combineReducers({ menu, tasks, users });

export default reducers;
