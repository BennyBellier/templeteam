import { Login } from "@/components/features/Login/Login";

export type SignInProps = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

export default function SignIn(props : SignInProps) {
  return (
    <Login
      error={props.searchParams?.error}
      callbackUrl={props.searchParams?.callbackUrl}
    />
  );
}