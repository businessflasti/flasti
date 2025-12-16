-- Add onboarding_completed column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.onboarding_completed IS 'Indicates whether the user has completed the onboarding tour';
