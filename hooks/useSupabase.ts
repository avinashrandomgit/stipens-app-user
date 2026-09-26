import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createClerkSupabaseClient } from "../lib/helpers/supabase";

export function useSupabase() {
  const { getToken } = useAuth();

  const client = useMemo(() => createClerkSupabaseClient(() => getToken()), []);

  return client;
}
