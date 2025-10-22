const API_URL = "http://localhost:8080/users";

export async function getUsers() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Erro ao buscar usuários");
  return await response.json();
}

export async function getUserById(id) {
  const response = await fetch(`${API_URL}/${id}`);
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
  const response = await fetch(`${API_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error("Erro ao atualizar usuário");
  return await response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir usuário");
}
