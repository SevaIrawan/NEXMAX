// Supabase Configuration
const SUPABASE_URL = 'https://bbuxfnchflhtulainndm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginCard = document.querySelector('.login-card');
const registerCard = document.getElementById('registerCard');
const messageDiv = document.getElementById('message');

// Show/Hide Register Form
function showRegister() {
    loginCard.style.transform = 'translateX(-100%)';
    registerCard.classList.add('show');
}

function showLogin() {
    registerCard.classList.remove('show');
    loginCard.style.transform = 'translateX(0)';
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Show Message
function showMessage(message, type = 'info') {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Clear Message
function clearMessage() {
    messageDiv.style.display = 'none';
    messageDiv.textContent = '';
}

// Set Loading State
function setLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    if (isLoading) {
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
    } else {
        button.disabled = false;
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
}

// Show Forgot Password
function showForgotPassword() {
    showMessage('Fitur lupa password akan segera tersedia. Silakan hubungi administrator.', 'info');
}

// Simple login function for existing users table
async function loginWithExistingTable(username, password) {
    try {
        console.log('Attempting login for username:', username);
        
        // Get user from existing users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        console.log('Database response:', { userData, userError });

        if (userError) {
            console.error('Database error:', userError);
            throw new Error(`Database error: ${userError.message}`);
        }

        if (!userData) {
            throw new Error('Username tidak ditemukan');
        }

        console.log('User found:', userData);

        // For now, we'll use a simple password check
        // In production, you should use proper password hashing
        if (password === 'Admin123!' && username === 'admin') {
            // Create a simple session
            const sessionData = {
                id: userData.id,
                username: userData.username,
                role: userData.role,
                loggedIn: true,
                timestamp: new Date().toISOString()
            };

            console.log('Creating session:', sessionData);

            // Store session
            localStorage.setItem('nexmax_session', JSON.stringify(sessionData));
            
            return { success: true, user: sessionData };
        } else {
            throw new Error('Password salah');
        }

    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Login Form Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    console.log('Login attempt:', { username, password, remember });

    const loginBtn = document.querySelector('.login-btn');
    setLoading(loginBtn, true);

    try {
        // Use existing users table for authentication
        const result = await loginWithExistingTable(username, password);

        if (result.success) {
            if (remember) {
                localStorage.setItem('user', JSON.stringify(result.user));
            } else {
                sessionStorage.setItem('user', JSON.stringify(result.user));
            }

            showMessage('Login berhasil! Mengalihkan ke dashboard...', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }

    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Terjadi kesalahan saat login';
        
        if (error.message.includes('Username tidak ditemukan')) {
            errorMessage = 'Username tidak ditemukan';
        } else if (error.message.includes('Password salah')) {
            errorMessage = 'Password salah';
        } else if (error.message.includes('Database error')) {
            errorMessage = `Error database: ${error.message}`;
        } else if (error.message.includes('Too many requests')) {
            errorMessage = 'Terlalu banyak percobaan login. Silakan coba lagi nanti';
        }
        
        showMessage(errorMessage, 'error');
    } finally {
        setLoading(loginBtn, false);
    }
});

// Register Form Handler
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const username = document.getElementById('regUsername').value;
    const fullName = document.getElementById('regName').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
        showMessage('Password tidak cocok', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password minimal 6 karakter', 'error');
        return;
    }

    if (username.length < 3) {
        showMessage('Username minimal 3 karakter', 'error');
        return;
    }

    const registerBtn = document.querySelector('.register-btn');
    setLoading(registerBtn, true);

    try {
        // Check if username already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            throw new Error('Username sudah digunakan');
        }

        // Insert new user into existing users table
        const { error: insertError } = await supabase
            .from('users')
            .insert([{ 
                username: username, 
                password: password, // In production, hash this password
                role: 'user'
            }]);

        if (insertError) {
            throw insertError;
        }

        showMessage('Registrasi berhasil! Silakan login dengan username Anda.', 'success');
        registerForm.reset();
        setTimeout(() => {
            registerCard.classList.remove('show');
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Terjadi kesalahan saat registrasi';
        
        if (error.message.includes('Username sudah digunakan')) {
            errorMessage = 'Username sudah digunakan. Silakan pilih username lain';
        } else if (error.message.includes('Password should be at least')) {
            errorMessage = 'Password terlalu pendek';
        }
        
        showMessage(errorMessage, 'error');
    } finally {
        setLoading(registerBtn, false);
    }
});

// Check if user is already logged in
function checkAuthStatus() {
    const session = localStorage.getItem('nexmax_session') || sessionStorage.getItem('nexmax_session');
    if (session) {
        const sessionData = JSON.parse(session);
        if (sessionData.loggedIn) {
            window.location.href = 'index.html';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

// Handle forgot password
document.querySelector('.forgot-password').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email) {
        showMessage('Silakan masukkan email terlebih dahulu', 'warning');
        return;
    }
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html'
        });
        
        if (error) {
            throw error;
        }
        
        showMessage('Link reset password telah dikirim ke email Anda', 'success');
        
    } catch (error) {
        console.error('Password reset error:', error);
        showMessage('Terjadi kesalahan saat mengirim email reset password', 'error');
    }
});

// Utility function to get user data
function getUserData() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Export for use in other files
window.authUtils = {
    supabase,
    getUserData,
    showMessage
}; 