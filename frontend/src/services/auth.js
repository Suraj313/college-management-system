import api from "./api";

export async function loginRequest(email, password) {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.access_token);
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export async function fetchCurrentUser() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function registerRequest(name, email, password, role = "student") {
  const res = await api.post("/auth/register", { name, email, password, role });
  return res.data;
}
