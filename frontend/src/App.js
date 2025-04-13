import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle, lightTheme, darkTheme } from './theme';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('http://127.0.0.1:8000/todos/');
    const data = await response.json();
    setTodos(data);
  };

  const handleAddTodo = async () => {
    if (newTodo) {
      const response = await fetch('http://127.0.0.1:8000/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
      });

      if (response.ok) {
        fetchTodos();
        setNewTodo('');
      }
    }
  };

  const handleToggleCompleted = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const updatedTodo = {
      title: todo.title,
      completed: !todo.completed,
    };

    await fetch(`http://127.0.0.1:8000/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });

    fetchTodos();
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/todos/${id}`, {
      method: 'DELETE',
    });

    fetchTodos();
  };

  const handleSaveEdit = async (id) => {
    await fetch(`http://127.0.0.1:8000/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editedTitle,
        completed: todos.find((t) => t.id === id).completed,
      }),
    });

    setEditingId(null);
    setEditedTitle('');
    fetchTodos();
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <ToggleContainer>
        <Button onClick={handleToggleDarkMode}>
          {darkMode ? '☀️ Light' : '🌙 Dark'} Mode
        </Button>
      </ToggleContainer>
      <Container>
        <Title>List of Task</Title>
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <Button onClick={handleAddTodo}>Add Task</Button>

        <FilterContainer>
          <FilterButton onClick={() => setFilter('all')} active={filter === 'all'}>All</FilterButton>
          <FilterButton onClick={() => setFilter('completed')} active={filter === 'completed'}>Completed</FilterButton>
          <FilterButton onClick={() => setFilter('pending')} active={filter === 'pending'}>Pending</FilterButton>
        </FilterContainer>

        <TaskList>
          {todos
            .filter((todo) => {
              if (filter === 'completed') return todo.completed;
              if (filter === 'pending') return !todo.completed;
              return true;
            })
            .map((todo) => (
              <Task key={todo.id}>
                <Checkbox
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleCompleted(todo.id)}
                />
                {editingId === todo.id ? (
                  <EditInput
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(todo.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                    autoFocus
                  />
                ) : (
                  <TaskText
                    completed={todo.completed}
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditedTitle(todo.title);
                    }}
                  >
                    {todo.title}
                  </TaskText>
                )}
                <DeleteButton onClick={() => handleDelete(todo.id)}>
                  Delete
                </DeleteButton>
              </Task>
            ))}
        </TaskList>
      </Container>
    </ThemeProvider>
  );
};

export default App;

// ---------- Styled Components ----------

const ToggleContainer = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  padding: 0.5rem;
  border-radius: 8px;
  width: 10%;
  
`;

const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 4rem auto 0;
  text-align: center;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 80%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  width: 80%;
`;

const TaskList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Task = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 10px;
  margin: 5px 0;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const TaskText = styled.span`
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
  flex-grow: 1;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
`;

const EditInput = styled.input`
  padding: 5px;
  width: 100%;
`;

const FilterContainer = styled.div`
  margin: 1rem 0;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  margin: 0 5px;
  background-color: ${({ active }) => (active ? '#2196f3' : '#e0e0e0')};
  color: ${({ active }) => (active ? 'white' : 'black')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
