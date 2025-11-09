// auth.js - Xác thực người dùng

const Auth = {
    init() {
        // Login
        document.getElementById('loginBtn').addEventListener('click', this.handleLogin.bind(this));
        document.getElementById('gotoSignup').addEventListener('click', () => {
            switchScreen('signupScreen');
        });

        // Signup
        document.getElementById('signupBtn').addEventListener('click', this.handleSignup.bind(this));
        document.getElementById('gotoLogin').addEventListener('click', () => {
            switchScreen('loginScreen');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', this.handleLogout.bind(this));

        // Enter key
        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        document.getElementById('signupPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSignup();
        });
    },

    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showToast('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const users = Storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            Storage.setCurrentUser(user);
            switchScreen('chatScreen');
            App.loadUserData();
            showToast(`Chào mừng ${user.name}!`);
        } else {
            showToast('Email hoặc mật khẩu không đúng!');
        }
    },

    handleSignup() {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;

        if (!name || !email || !password) {
            showToast('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const users = Storage.getUsers();
        
        if (users.find(u => u.email === email)) {
            showToast('Email đã tồn tại!');
            return;
        }

        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            password: password,
            avatar: '👤',
            status: 'online',
            friends: []
        };

        users.push(newUser);
        Storage.saveUsers(users);
        Storage.setCurrentUser(newUser);
        
        switchScreen('chatScreen');
        App.loadUserData();
        showToast(`Chào mừng ${name}!`);
    },

    handleLogout() {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            Storage.clearCurrentUser();
            switchScreen('loginScreen');
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            showToast('Đã đăng xuất!');
        }
    }
};