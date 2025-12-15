import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * (from the supabase dashboard:)
 * "This key is safe to use in a browser if you have enabled Row Level Security (RLS)
 * for your tables and configured policies."
 * I will monitor this, but for now, I think it's safe to push to remote repo.
 */
export const supabase = createClient(
  "https://yuxrgwutmjlopdjjhmcz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eHJnd3V0bWpsb3BkampobWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjYzMTAsImV4cCI6MjA4MTM0MjMxMH0.sS_t4p4_oCzgFHd5yfdCqw90ScKo9b3zlkSu4KppISw",
);
