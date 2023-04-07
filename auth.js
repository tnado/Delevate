// Import the Supabase client
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient('your-supabase-url', 'your-supabase-api-key');

// Sign up form
const signUpForm = document.getElementById('sign-up-form');
signUpForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('sign-up-email').value;
  const password = document.getElementById('sign-up-password').value;

  try {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error signing up:', error.message);
    } else {
      console.log('User signed up:', user);
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error signing up:', error.message);
  }
});

// Sign in form
const signInForm = document.getElementById('sign-in-form');
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('sign-in-email').value;
  const password = document.getElementById('sign-in-password').value;

  try {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      console.log('User signed in:', user);
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error signing in:', error.message);
  }
});
