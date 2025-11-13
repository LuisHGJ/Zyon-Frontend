const API_URL = "http://localhost:8080/tasks";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getTasks() {
    const res = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    if (!res.ok) throw new Error("Erro ao carregar tasks");
    return res.json();
  }
  
  export async function createTask(task) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Erro ao criar task");
    return res.json();
  }
  
  export async function updateTask(id, task) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Erro ao atualizar task");
    return res.json();
  }
  
  export async function deleteTask(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error("Erro ao excluir task");
  }