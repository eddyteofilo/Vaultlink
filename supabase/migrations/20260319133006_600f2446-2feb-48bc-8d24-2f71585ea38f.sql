
-- Create secrets table for storing API keys, tokens, hashes
CREATE TABLE public.secrets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'api_key',
  value_encrypted TEXT NOT NULL,
  notes TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own secrets" ON public.secrets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own secrets" ON public.secrets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own secrets" ON public.secrets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own secrets" ON public.secrets FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_secrets_updated_at BEFORE UPDATE ON public.secrets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update plans pricing
UPDATE public.plans SET price = 14.99 WHERE name = 'pro';
