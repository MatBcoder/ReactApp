import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      // 1. Create user in Firebase
      await createUserWithEmailAndPassword(auth, email, password);

      // 2. Get Firebase token
      const token = await auth.currentUser.getIdToken();

      // 3. Tell Node to register user in Supabase
      await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Account created. You can now log in.");

    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>

      <input
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
