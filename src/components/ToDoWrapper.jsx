import React, { useState, useEffect } from "react";
import { ToDoForm } from "./ToDoForm";
import {v4 as uuidv4} from "uuid";
import { ToDo } from "./ToDo";
import { EditToDoForm } from "./EditToDoForm";
import { ImPrevious } from "react-icons/im";
import initialTodos from "../initialTodos.json";
uuidv4();
import {
  getTodos,
  addTodo as addTodoApi,
  updateTodo as updateTodoApi,
  deleteTodo as deleteTodoApi
} from "../services/todoService";

export const ToDoWrapper = () => {
    const [todos, setTodos] = useState([])
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Load from backend
    useEffect(() => {
        loadTodos();
    }, [page]);

const loadTodos = async () => {
        try {
            const data = await getTodos(page, 4);
            const mapped = data.content.map(item => ({
                id: item.id,
                task: item.task,
                completed: item.completed,
                isEditing: false
            }));
            setTodos(mapped);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Error loading todos:", err);
        }
    };

    // ADD TODO (POST to backend)
const addTodo = async (todoText) => {
  await addTodoApi(todoText);
  if (page === 0) {
      loadTodos();       // manually reload when you're already on page 0
    } else {
      setPage(0);        // this will reload automatically via useEffect
    }
};



    // TOGGLE COMPLETE (PUT to backend)
    const toggleComplete = async (id) => {
        const todo = todos.find(t => t.id === id);
        const updated = await updateTodoApi(id, {
            ...todo,
            completed: !todo.completed
        });

        setTodos(todos.map(t => t.id === id ? { ...updated, isEditing: false } : t));
    };

    // DELETE TODO (DELETE from backend)
    const deleteToDo = async (id) => {
        await deleteTodoApi(id);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    // TOGGLE EDIT MODE
    const editToDo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
        ));
    };

    // UPDATE TODO TITLE (PUT to backend)
    const editTask = async (newTask, id) => {
        const todo = todos.find(t => t.id === id);
        const updated = await updateTodoApi(id, {
            ...todo,
            task: newTask
        });

        setTodos(todos.map(t =>
            t.id === id ? { ...updated, isEditing: false } : t
        ));
    };


    return(
        <div className="TodoWrapper">
            <h1>My ToDo List!</h1>
             <ToDoForm addTodo={addTodo}/>

                        {todos.map((todo) => (
                            todo.isEditing ? (
                                <EditToDoForm
                                    key={todo.id}
                                    editTodo={editTask}
                                    task={todo}
                                />
                            ) : (
                                <ToDo
                                    key={todo.id}
                                    task={todo}
                                    toggleComplete={() => toggleComplete(todo.id)}
                                    deleteToDo={() => deleteToDo(todo.id)}
                                    editToDo={() => editToDo(todo.id)}
                                />
                            )
                        ))}
                     {/* Pagination Section */}
                        <div className="pagination">
                          <button
                            className="pagination-btn"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                          >
                            ← Previous
                          </button>

                          <span className="pagination-info">
                            Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
                          </span>

                          <button
                            className="pagination-btn"
                            disabled={page + 1 === totalPages}
                            onClick={() => setPage(page + 1)}
                          >
                            Next →
                          </button>
                        </div>
                    </div>
                );
            };