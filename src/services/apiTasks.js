const API_URL = "http://localhost:8080/tasks";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function completeTask(taskId) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Usuário não autenticado.');
    }

    const response = await fetch(`${API_URL}/${taskId}/complete`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorDetail = await response.json().catch(() => ({ message: 'Erro ao conectar com o servidor.' }));
        throw new Error(`Falha na conclusão da Task: ${errorDetail.message || response.statusText}`);
    }

    const updatedUser = await response.json(); 
    return updatedUser;
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