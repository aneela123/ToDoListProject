const API_URL = "http://localhost:8080/api/tasks";

export const getTodos = async () => {
  const response = await fetch(API_URL);
  return response.json();

};

export const addTodo = async (task) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, completed: false }),
  });
  return response.json();
};

export const updateTodo = async (id, updatedTodo) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTodo),
  });
  return response.json();
};

export const deleteTodo = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
