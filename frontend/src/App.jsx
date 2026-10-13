import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

/** Render the deterministic in-memory task lifecycle used by browser tests. */
function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const nextId = useRef(1);

  /** Add a trimmed task when the input contains non-whitespace text. */
  function addTodo() {
    const title = inputValue.trim();
    if (title === '') {
      return;
    }

    const todo = { id: nextId.current, title, completed: false };
    nextId.current += 1;
    setTodos((currentTodos) => [...currentTodos, todo]);
    setInputValue('');
  }

  /** Add a task when the user presses Enter in the task input. */
  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTodo();
    }
  }

  /** Toggle completion for only the task with the supplied identifier. */
  function toggleTodo(id) {
    setTodos((currentTodos) => currentTodos.map((todo) => (
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )));
  }

  /** Remove only the task with the supplied identifier. */
  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  return (
    <main className="page-shell">
      <section className="todo-panel" aria-labelledby="page-title">
        <p className="eyebrow">A deterministic test fixture</p>
        <h1 id="page-title">Todo App</h1>
        <form
          className="task-entry"
          onSubmit={(event) => {
            event.preventDefault();
            addTodo();
          }}
        >
          <label className="visually-hidden" htmlFor="todo-input-field">
            Task title
          </label>
          <input
            id="todo-input-field"
            data-testid="todo-input"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="What needs doing?"
            autoComplete="off"
          />
          <button data-testid="add-button" type="submit">
            Add
          </button>
        </form>

        {todos.length === 0 && (
          <p className="empty-state" data-testid="empty-state">
            No tasks yet.
          </p>
        )}

        <ul className="todo-list" data-testid="todo-list" aria-label="Tasks">
          {todos.map((todo) => (
            <li
              className="todo-item"
              key={todo.id}
              data-testid={`todo-item-${todo.id}`}
            >
              <input
                className="todo-checkbox"
                type="checkbox"
                data-testid={`todo-checkbox-${todo.id}`}
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark ${todo.title} as complete`}
              />
              <span
                className="todo-title"
                data-testid={`todo-title-${todo.id}`}
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              >
                {todo.title}
              </span>
              <button
                className="delete-button"
                type="button"
                data-testid={`todo-delete-${todo.id}`}
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete ${todo.title}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

App.propTypes = {};

export default App;
