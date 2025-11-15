const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

const token = localStorage.getItem("token");

export async function getUsers() {
  const response = await fetch(API_URL, {
    headers: { 
      "Content-Type": "application/json" ,
      "Authorization": `Bearer ${token}`
  }
  });
  if (!response.ok) throw new Error("Erro ao buscar usuários");
  return await response.json();
}

export async function getUserById(id) {
  const token = localStorage.getItem("token"); 
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`, 
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar usuário");
  return await response.json();
}

export async function createUser(user) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) throw new Error("Erro ao criar usuário");
  return await response.json();
}

export async function updateUser(user) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) throw new Error("Erro ao atualizar usuário");
  return await response.json();
}

export async function deleteUser(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`, 
    },
  });

  if (!response.ok) throw new Error("Erro ao excluir usuário");
}
