import React, { useState, useEffect } from "react";
import { ToDoForm } from "./ToDoForm";
import {v4 as uuidv4} from "uuid";
import { ToDo } from "./ToDo";
import { EditToDoForm } from "./EditToDoForm";
import { ImPrevious } from "react-icons/im";
import initialTodos from "../initialTodos.json";
uuidv4();

export const ToDoWrapper = () => {
    const [todos, setTodos] = useState([])

    useEffect(() => {
            fetch("http://localhost:8080/api/tasks")
                .then(response => response.json())
                .then(data => {
                    console.log("Backend data:", data);
                    // Backend uses 'title' but UI uses 'task', so map fields
                    const mapped = data.map(item => ({
                        id: item.id,
                        task: item.title,
                        completed: item.completed,
                        isEditing: false
                    }));
                    setTodos(mapped);
                })
                .catch(err => console.error("Error fetching tasks:", err));
        }, []);

    const addTodo = todo => {
        setTodos([...todos, {id: uuidv4(), task: todo,
            completed: false, isEditing: false}])
        console.log(todos)
    }

    const toggleComplete = id => {
        setTodos(todos.map(todo => todo.id === id ? 
            {...todo, completed: !todo.completed} : todo)
        )
    }
    
    const deleteToDo = id => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const editToDo = id => {
        setTodos(todos.map(todo => todo.id === id ? 
            {...todo, isEditing: !todo.isEditing}: todo)
        )
    }

    const editTask = (task, id) => {
        setTodos(todos.map(todo => todo.id === id ? 
            {...todo, task, isEditing: !todo.isEditing}: todo)
        )
    }

    return(
        <div className="TodoWrapper">
            <h1>My ToDo List!</h1>
            <ToDoForm addTodo={addTodo}/>
            {todos.map((todo, index) => (
                todo.isEditing ? (
                    <EditToDoForm editTodo={editTask} task={todo}/>
                ) : (
                <ToDo task = {todo} key={index} 
                  toggleComplete={toggleComplete} deleteToDo = {deleteToDo} editToDo={editToDo}/>
                )
            ))}
            
        </div>

    );
}