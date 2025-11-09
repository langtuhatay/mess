// storage.js - Quản lý dữ liệu local

const Storage = {
  // Dữ liệu users mặc định
  defaultUsers: [
    {
      id: 1,
      name: "Admin",
      email: "admin@messenger.com",
      password: "admin123",
      avatar: "👨‍💼",
      status: "online",
      friends: [2, 3],
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      password: "123456",
      avatar: "👨",
      status: "online",
      friends: [1, 3],
    },
    {
      id: 3,
      name: "Trần Thị B",
      email: "thib@gmail.com",
      password: "123456",
      avatar: "👩",
      status: "offline",
      friends: [1, 2],
    },
    {
      id: 4,
      name: "Lê Văn C",
      email: "vanc@gmail.com",
      password: "123456",
      avatar: "👨‍💻",
      status: "online",
      friends: [],
    },
    {
      id: 5,
      name: "Phạm Thị D",
      email: "thid@gmail.com",
      password: "123456",
      avatar: "👩‍💻",
      status: "offline",
      friends: [],
    },
  ],

  defaultMessages: {
    "1-2": [
      { id: 1, senderId: 1, text: "Chào bạn!", time: "10:00" },
      { id: 2, senderId: 2, text: "Hi Admin! Bạn khỏe không?", time: "10:01" },
    ],
    "1-3": [
      { id: 1, senderId: 3, text: "Xin chào Admin", time: "09:30" },
      { id: 2, senderId: 1, text: "Chào bạn B!", time: "09:31" },
    ],
  },

  // Khởi tạo dữ liệu
  init() {
    if (!localStorage.getItem("messenger_users")) {
      this.saveUsers(this.defaultUsers);
    }
    if (!localStorage.getItem("messenger_messages")) {
      this.saveMessages(this.defaultMessages);
    }
    if (!localStorage.getItem("messenger_requests")) {
      this.saveFriendRequests([]);
    }
  },

  // Users
  getUsers() {
    return (
      JSON.parse(localStorage.getItem("messenger_users")) || this.defaultUsers
    );
  },

  saveUsers(users) {
    localStorage.setItem("messenger_users", JSON.stringify(users));
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id);
  },

  updateUser(userId, updates) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  },

  // Messages
  getMessages() {
    return (
      JSON.parse(localStorage.getItem("messenger_messages")) ||
      this.defaultMessages
    );
  },

  saveMessages(messages) {
    localStorage.setItem("messenger_messages", JSON.stringify(messages));
  },

  getChatMessages(user1Id, user2Id) {
    const chatKey = [user1Id, user2Id].sort().join("-");
    const messages = this.getMessages();
    return messages[chatKey] || [];
  },

  addMessage(user1Id, user2Id, message) {
    const chatKey = [user1Id, user2Id].sort().join("-");
    const messages = this.getMessages();
    if (!messages[chatKey]) {
      messages[chatKey] = [];
    }
    messages[chatKey].push(message);
    this.saveMessages(messages);
  },

  // Friend Requests
  getFriendRequests() {
    return JSON.parse(localStorage.getItem("messenger_requests")) || [];
  },

  saveFriendRequests(requests) {
    localStorage.setItem("messenger_requests", JSON.stringify(requests));
  },

  addFriendRequest(fromId, toId) {
    const requests = this.getFriendRequests();
    if (!requests.find((r) => r.from === fromId && r.to === toId)) {
      requests.push({ from: fromId, to: toId });
      this.saveFriendRequests(requests);
    }
  },

  removeFriendRequest(fromId, toId) {
    const requests = this.getFriendRequests();
    const filtered = requests.filter(
      (r) => !(r.from === fromId && r.to === toId)
    );
    this.saveFriendRequests(filtered);
  },

  // Current User
  setCurrentUser(user) {
    sessionStorage.setItem("current_user", JSON.stringify(user));
  },

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("current_user"));
  },

  clearCurrentUser() {
    sessionStorage.removeItem("current_user");
  },
};

// Khởi tạo storage khi load
Storage.init();
