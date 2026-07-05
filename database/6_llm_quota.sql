-- SQL migration to add LLM quota tracking columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS llm_query_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS llm_reset_date timestamp with time zone DEFAULT now();
