"use client";

import { getServerAuthSession } from "@/lib/auth";
import { signIn, signOut, useSession } from "next-auth/react";

export default async function Login() {
  // const session = await getServerAuthSession();
  return (
    <form>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { data: sessionData } = useSession();

  return (
    <button onClick={sessionData ? () => void signOut() : () => void signIn()}>
      {sessionData ? "Logout" : "Login"}
    </button>
  );
}
