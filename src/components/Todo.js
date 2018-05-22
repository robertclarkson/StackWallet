import React from 'react'
import PropTypes from 'prop-types'

const Todo = ({ onClick, deleteTodo, completed, text, id }) => (
  <tr
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    <td>
      <input type="checkbox" onClick={onClick} />
    </td>
    <td>
      <span> {id} {text} </span>
    </td>
    <td>
      <button onClick={deleteTodo}> X </button>
    </td>
  </tr>
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default Todo
