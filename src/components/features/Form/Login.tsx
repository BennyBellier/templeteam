// "use client";

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { signIn } from 'next-auth/react';


// export default function LoginForm() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [error, setError] = useState(null);

//   const onSubmit = async (data) => {
//     setError(null);
//     const res = await signIn('credentials', {
//       redirect: false,
//       identifier: data.identifier,
//       password: data.password,
//     });

//     if (res?.error) {
//       setError(res.error);
//     } else if (res?.ok) {
//         // Redirect or handle successful login
//         window.location.href = "/admin" // Example redirect
//     }

//   };


//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div>
//         <label htmlFor="identifier">Email ou Username</label>
//         <input
//           type="text"
//           id="identifier"
//           {...register('identifier', { required: 'Identifiant requis' })}
//         />
//         {errors.identifier && <span role="alert">{errors.identifier.message}</span>}
//       </div>

//       <div>
//         <label htmlFor="password">Mot de passe</label>
//         <input
//           type="password"
//           id="password"
//           {...register('password', { required: 'Mot de passe requis' })}
//         />
//         {errors.password && <span role="alert">{errors.password.message}</span>}
//       </div>

//         {error && <div role="alert" style={{color: "red"}}>{error}</div>}

//       <button type="submit">Se connecter</button>
//     </form>
//   );
// }