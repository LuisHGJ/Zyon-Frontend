const API_URL = "http://localhost:8080/tasks";

const token = localStorage.getItem("token");

export async function getTasks() {
    const response = await fetch(API_URL, {
        headers: { 
            "Content-Type": "application/json" ,
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error("Erro ao buscar tarefas");
    return await response.json();
};

export async function createTask(task) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Erro ao criar tarefa");
    return await response.json();
};

export async function updateTask(id, task) {
    const response = await fetch(`${API_URL}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json" ,
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Erro ao atualizar tarefa");
    return await response.json();
};
  
  export async function deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json" ,
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) throw new Error("Erro ao excluir tarefa");
};