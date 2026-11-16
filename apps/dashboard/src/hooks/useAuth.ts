import { useAuthContext } from '../context/AuthContext.tsx';

export function useAuth() {
  return useAuthContext();
}

export { useAuthContext };
export type { AuthContextType } from '../context/AuthContext.tsx';
