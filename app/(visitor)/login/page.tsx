import { Login } from "@/components/features/Form/Login";
import { Layout, LayoutSection } from "@/components/layout/layout";

export type SignInProps = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

export default function SignIn(props: SignInProps) {
  return (
    <Layout noContact noReferences>
      <LayoutSection className="self-center">
        <Login
          error={props.searchParams?.error}
          callbackUrl={props.searchParams?.callbackUrl}
        />
      </LayoutSection>
    </Layout>
  );
}
