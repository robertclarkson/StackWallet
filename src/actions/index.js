import React from 'react'
import { connect } from 'react-redux'
// let nextTodoId = 0


export const addTodo = (text) => ({
  type: 'ADD_TODO',
  text
})

export const getNextId = () => ({
  type: 'INCREMENT'
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const deleteTodo = index => ({
  type: 'DELETE_TODO',
  index
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
