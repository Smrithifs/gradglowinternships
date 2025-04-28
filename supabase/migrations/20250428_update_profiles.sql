
-- Add email column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Update the handle_new_user function to store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'role', 
    new.raw_user_meta_data->>'name',
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN new;
END;
$$;
