import { useAuth } from "@/hooks/useAuth";

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const { token } = useAuth.getState();
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 