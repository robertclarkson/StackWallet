import { combineReducers } from 'redux'
import todos from './todos'
import incrementer from './incrementer'
import visibilityFilter from './visibilityFilter'

export default combineReducers({
  incrementer,
  todos,
  visibilityFilter
})
