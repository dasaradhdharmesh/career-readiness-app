const API_BASE = "http://localhost:8000";

export async function postForm(path, form) {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", body: form });
  return res.json();
}

export async function postJson(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return res.json();
}
