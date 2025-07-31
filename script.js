// Dashboard JavaScript

// Supabase Configuration
const SUPABASE_URL = 'https://bbuxfnchflhtulainndm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXhmbmNoZmxodHVsYWlubmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDYzMjYsImV4cCI6MjA2OTQyMjMyNn0.AF6IiaeGB9-8FYZNKQsbnl5yZmSjBMj7Ag4eUunEbtc';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check Authentication
function checkAuth() {
    const session = localStorage.getItem('nexmax_session') || sessionStorage.getItem('nexmax_session');
    
    if (!session) {
        // User not authenticated, redirect to login
        window.location.href = 'login.html';
        return;
    }

    const sessionData = JSON.parse(session);
    if (!sessionData.loggedIn) {
        // Session expired or invalid
        localStorage.removeItem('nexmax_session');
        sessionStorage.removeItem('nexmax_session');
        window.location.href = 'login.html';
        return;
    }

    // Update user profile display
    updateUserProfile(sessionData);
}

// Update User Profile Display
function updateUserProfile(user) {
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    if (userName) {
        // Use username from session
        userName.textContent = user.username || 'User';
    }

    if (userAvatar) {
        userAvatar.src = 'https://via.placeholder.com/40';
    }
}

// Logout Function
function logout() {
    try {
        // Clear session data
        localStorage.removeItem('nexmax_session');
        sessionStorage.removeItem('nexmax_session');
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

        // Redirect to login
        window.location.href = 'login.html';

    } catch (error) {
        console.error('Logout error:', error);
        alert('Terjadi kesalahan saat logout');
    }
}

// User Dropdown Toggle
function initUserDropdown() {
    const userProfile = document.getElementById('userProfile');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (userProfile && dropdownMenu && dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
}

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference or default to light theme
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Sidebar Toggle
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Navigation
const navLinks = document.querySelectorAll('.sidebar-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.parentElement.classList.remove('active'));

        // Add active class to clicked link
        link.parentElement.classList.add('active');

        // Update content based on navigation
        const target = link.getAttribute('href').substring(1);
        updateContent(target);
    });
});

function updateContent(section) {
    const content = document.querySelector('.dashboard-content');

    // Simple content switching (you can expand this)
    switch(section) {
        case 'dashboard':
            content.innerHTML = getDashboardContent();
            break;
        case 'analytics':
            content.innerHTML = getAnalyticsContent();
            break;
        case 'users':
            content.innerHTML = getUsersContent();
            break;
        case 'settings':
            content.innerHTML = getSettingsContent();
            break;
    }

    // Reinitialize charts if needed
    if (section === 'dashboard' || section === 'analytics') {
        initializeCharts();
    }
}

function getDashboardContent() {
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Pengguna</h3>
                    <p class="stat-number">1,234</p>
                    <span class="stat-change positive">+12.5%</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="stat-info">
                    <h3>Penjualan</h3>
                    <p class="stat-number">$45,678</p>
                    <span class="stat-change positive">+8.3%</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="stat-info">
                    <h3>Tampilan</h3>
                    <p class="stat-number">89,432</p>
                    <span class="stat-change positive">+15.2%</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                    <h3>Pertumbuhan</h3>
                    <p class="stat-number">23.4%</p>
                    <span class="stat-change negative">-2.1%</span>
                </div>
            </div>
        </div>

        <div class="charts-section">
            <div class="chart-container">
                <h3>Grafik Penjualan</h3>
                <canvas id="salesChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Distribusi Pengguna</h3>
                <canvas id="userChart"></canvas>
            </div>
        </div>

        <div class="activity-section">
            <h3>Aktivitas Terbaru</h3>
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <div class="activity-content">
                        <p>Pengguna baru mendaftar</p>
                        <span>2 menit yang lalu</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="activity-content">
                        <p>Pesanan baru diterima</p>
                        <span>5 menit yang lalu</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="activity-content">
                        <p>Review baru ditambahkan</p>
                        <span>10 menit yang lalu</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getAnalyticsContent() {
    return `
        <div class="charts-section">
            <div class="chart-container">
                <h3>Analitik Detail</h3>
                <canvas id="analyticsChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Metrik Kinerja</h3>
                <canvas id="performanceChart"></canvas>
            </div>
        </div>
    `;
}

function getUsersContent() {
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="stat-info">
                    <h3>Pengguna Aktif</h3>
                    <p class="stat-number">892</p>
                    <span class="stat-change positive">+5.2%</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>Pengguna Baru</h3>
                    <p class="stat-number">156</p>
                    <span class="stat-change positive">+12.8%</span>
                </div>
            </div>
        </div>
    `;
}

function getSettingsContent() {
    return `
        <div class="chart-container">
            <h3>Pengaturan Dashboard</h3>
            <p>Konfigurasi dashboard akan ditampilkan di sini.</p>
        </div>
    `;
}

// Initialize Charts
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Penjualan',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // User Distribution Chart
    const userCtx = document.getElementById('userChart');
    if (userCtx) {
        new Chart(userCtx, {
            type: 'doughnut',
            data: {
                labels: ['Desktop', 'Mobile', 'Tablet'],
                datasets: [{
                    data: [60, 30, 10],
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#f59e0b'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Analytics Chart
    const analyticsCtx = document.getElementById('analyticsChart');
    if (analyticsCtx) {
        new Chart(analyticsCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Traffic',
                    data: [65, 59, 80, 81, 56, 55],
                    backgroundColor: '#8b5cf6'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'radar',
            data: {
                labels: ['Kecepatan', 'SEO', 'Aksesibilitas', 'Best Practices', 'PWA'],
                datasets: [{
                    label: 'Skor',
                    data: [85, 90, 75, 88, 92],
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: '#6366f1',
                    pointBackgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Search Functionality
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Add search functionality here
    console.log('Searching for:', searchTerm);
});

// Real-time Updates (simulated)
function updateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        const newValue = currentValue + Math.floor(Math.random() * 10);
        stat.textContent = stat.textContent.replace(/\d+/, newValue);
    });
}

// Update stats every 30 seconds
setInterval(updateStats, 30000);

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    checkAuth();

    // Initialize user dropdown
    initUserDropdown();

    // Initialize charts
    initializeCharts();

    // Initialize sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Initialize theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Initialize sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
        });
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .sidebar.open {
        transform: translateX(0);
    }

    @media (max-width: 768px) {
        .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
    }
`;
document.head.appendChild(style); 