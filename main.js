// Import the Supabase client
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient('your-supabase-url', 'your-supabase-api-key');

let currentUser;
let giveawaysRemaining = 3;

// Check if the user is authenticated
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || !session) {
    window.location.href = 'auth.html';
  } else {
    currentUser = session.user;
    document.getElementById('user-email').innerText = currentUser.email;

    // Fetch remaining giveaways from Supabase
    supabase
      .from('users')
      .select('*')
      .eq('id', currentUser.id)
      .then((response) => {
        if (response.data.length > 0) {
          giveawaysRemaining = response.data[0].giveaways_remaining;
          document.getElementById('giveaways-remaining').innerText = giveawaysRemaining;
        } else {
          // Initialize user record in Supabase
          supabase
            .from('users')
            .insert([{ id: currentUser.id, email: currentUser.email, giveaways_remaining: 3 }])
            .then(() => {
              document.getElementById('giveaways-remaining').innerText = 3;
            });
        }
      });
  }
});

// Log out functionality
document.getElementById('log-out').addEventListener('click', () => {
  supabase.auth.signOut().then(() => {
    window.location.href = 'auth.html';
  });
});

// Your existing JavaScript code for the giveaway app...
