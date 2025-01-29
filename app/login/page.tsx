import { use } from "react";
import { Login } from "@/components/features/Form/Login";
import { Layout, LayoutSection } from "@/components/layout/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports"
};

type Params = Promise<{ error: string, callbackUrl: string }>;
type SearchParams = Promise<Record<string, string> | undefined>;

export type SignInProps = Promise<{
  searchParams?: Record<"error", string>;
}>;

export default function SignIn(props: {params: Params, searchParams: SearchParams}) {
  const searchParams = use(props.searchParams)

  return (
    <Layout noContact noReferences>
      <LayoutSection className="self-center">
        <Login
          errorProps={searchParams?.error}
        />
      </LayoutSection>
    </Layout>
  );
}


// "use client";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import { signIn } from "next-auth/react";
// import { useState } from "react";

// export default function LoginPage() {
//     const { register, handleSubmit, formState: { errors } } = useForm();
//     const [error, setError] = useState(null);

//     const onSubmit = async (data: FieldValues) => {
//         setError(null);

//         const res = await signIn("credentials", {
//             redirect: false,
//             identifier: data.identifier,
//             password: data.password,
//         });

//         if (res?.error) {
//             setError(res.error);
//         } else if (res?.ok) {
//             window.location.href = "/admin";
//         }
//     };


//     return (
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <div>
//                 <label htmlFor="identifier">Email ou Username</label>
//                 <input
//                     type="text"
//                     id="identifier"
//                     {...register("identifier", { required: "Identifiant requis" })}
//                 />
//                 {errors.identifier && <span role="alert">{errors.identifier.message}</span>}
//             </div>

//             <div>
//                 <label htmlFor="password">Mot de passe</label>
//                 <input
//                     type="password"
//                     id="password"
//                     {...register("password", { required: "Mot de passe requis" })}
//                 />
//                 {errors.password && <span role="alert">{errors.password.message}</span>}
//             </div>

//             <div>
//                 <label htmlFor="remember">Se souvenir de moi</label>
//                 <input type="checkbox" id="remember" {...register("remember")} />
//             </div>

//             <div>
//                 <a href="#">Mot de passe oublié ?</a>
//             </div>

//             {error && <div role="alert" style={{ color: "red" }}>{error}</div>}

//             <button type="submit">Se connecter</button>
//         </form>
//     );
// }