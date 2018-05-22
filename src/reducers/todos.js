const todos = (state = [], action) => {
  
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_TODO':
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, completed: !todo.completed}
          : todo
      )
    case 'DELETE_TODO':
      // console.log(action.index)
      return [
          ...state.slice(0, action.index),
          ...state.slice(action.index + 1)
      ]
    default:
      return state
  }
}

export default todos
