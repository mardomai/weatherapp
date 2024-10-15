'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated') {
      fetchTodos();
    }
  }, [status]);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized: User not authenticated');
          // Optionally, redirect to login page or show an error message
          return;
        }
        throw new Error('Failed to add todo');
      }
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
    setEditedTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditedTitle('');
  };

  const saveEdit = async () => {
    if (!editingTodo) return;

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editedTitle }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      fetchTodos();
      setEditingTodo(null);
      setEditedTitle('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="w-full px-3 py-2 border rounded text-foreground bg-background"
          required
        />
        <button type="submit" className="w-full mt-2 bg-foreground text-background py-2 rounded">
          Add Todo
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between py-2">
            {editingTodo && editingTodo.id === todo.id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-grow px-2 py-1 mr-2 border rounded text-black"
                />
                <button onClick={saveEdit} className="px-2 py-1 bg-green-500 text-white rounded mr-2">Save</button>
                <button onClick={cancelEditing} className="px-2 py-1 bg-gray-500 text-white rounded">Cancel</button>
              </>
            ) : (
              <>
                <span
                  className={`flex-grow ${todo.completed ? 'line-through' : ''}`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => startEditing(todo)}
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
