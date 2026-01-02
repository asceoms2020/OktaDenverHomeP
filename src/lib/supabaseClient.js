import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project URL and Anon Key
const supabaseUrl = 'https://hbpgebflcnaqsyeqmaii.supabase.co';
const supabaseKey = 'sb_publishable_qSM8owdXDfIyGY7fRnkMiA_ob7WD3Hn';

export const supabase = createClient(supabaseUrl, supabaseKey);
