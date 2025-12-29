import React, { useState } from "react";
import { postForm } from "../api";

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function submit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);
    form.append("name", name);

    const res = await postForm("/auth/signup", form);

    if (res.access_token) {
      localStorage.setItem("token", res.access_token);
      onSignup(res.access_token);
    } else {
      alert("Signup failed");
    }
  }

  return (
    <div className="container">
      <h2>Sign up</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" onChange={e => setName(e.target.value)} />
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
