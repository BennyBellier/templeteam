// "use client";

// import { type ReactNode, createContext, useRef, useContext } from "react";
// import { useStore } from "zustand";
// import { type RegisterFormStore, createRegisterFormStore } from "@/stores/registerFormStore";

// export type RegisterFormStoreApi = ReturnType<typeof createRegisterFormStore>;

// export const RegisterFormStoreContext = createContext<RegisterFormStoreApi | undefined>(
//   undefined,
// );

// export interface RegisterFormStoreProviderProps {
//   children: ReactNode;
// }

// export const RegisterFormStoreProvider = ({
//   children,
// }: RegisterFormStoreProviderProps) => {
//   const storeRef = useRef<RegisterFormStoreApi>();
//   if (!storeRef.current) {
//     storeRef.current = createRegisterFormStore();
//   }

//   return (
//     <RegisterFormStoreContext.Provider value={storeRef.current}>
//       {children}
//     </RegisterFormStoreContext.Provider>
//   );
// };

// export const useRegisterFormStore = <T,>(selector: (store: RegisterFormStore) => T): T => {
//   const registerStoreContext = useContext(RegisterFormStoreContext);

//   if (!registerStoreContext) {
//     throw new Error(`useRegisterFormStore must be used within RegisterFormStoreProvider`);
//   }

//   return useStore(registerStoreContext, selector);
// };