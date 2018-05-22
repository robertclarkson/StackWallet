import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'

const TodoList = ({ todos, toggleTodo, deleteTodo }) => (
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Check</th>
        <th>ID / value</th>
        <th>delete</th>
      </tr>
    </thead>
    <tbody>
      {todos.map((todo,index) =>
        <Todo
          key={todo.id}
          id={todo.id}
          {...todo}
          onClick={() => toggleTodo(todo.id)}
          deleteTodo={() => deleteTodo(index)}
        />
      )}
    </tbody>
  </table>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  toggleTodo: PropTypes.func.isRequired
}

export default TodoList
