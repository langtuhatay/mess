const Chat = {
  currentChat: null,

  init() {
    this.loadChatList();
    this.setupMessageInput();
  },

  loadChatList() {
    const currentUser = Storage.getCurrentUser();
    if (!currentUser) return;

    const users = Storage.getUsers();
    const friends = users.filter((u) => currentUser.friends.includes(u.id));

    const chatsList = document.getElementById("chatsList");
    chatsList.innerHTML = "";

    if (friends.length === 0) {
      chatsList.innerHTML =
        '<p style="padding: 20px; text-align: center; color: #65676b;">Chưa có bạn bè nào</p>';
      return;
    }

    friends.forEach((friend) => {
      const messages = Storage.getChatMessages(currentUser.id, friend.id);
      const lastMessage = messages[messages.length - 1];

      const chatItem = document.createElement("div");
      chatItem.className = "chat-item";
      chatItem.onclick = () => this.openChat(friend);

      chatItem.innerHTML = `
                <div class="chat-item-avatar">
                    ${friend.avatar}
                    ${
                      friend.status === "online"
                        ? '<div class="online-dot"></div>'
                        : ""
                    }
                </div>
                <div class="chat-item-info">
                    <div class="chat-item-name">${friend.name}</div>
                    <div class="chat-item-message">
                        ${lastMessage ? lastMessage.text : "Bắt đầu trò chuyện"}
                    </div>
                </div>
            `;
      chatsList.appendChild(chatItem);
    });
  },

  openChat(user) {
    this.currentChat = user;

    // Update UI
    document.getElementById("emptyChatState").style.display = "none";
    document.getElementById("activeChatState").style.display = "flex";

    document.getElementById("chatAvatar").textContent = user.avatar;
    document.getElementById("chatName").textContent = user.name;
    document.getElementById("chatStatus").textContent =
      user.status === "online" ? "Đang hoạt động" : "Không hoạt động";

    // Load messages
    this.loadMessages();

    // Highlight active chat
    document.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
  },

  loadMessages() {
    const currentUser = Storage.getCurrentUser();
    const messages = Storage.getChatMessages(
      currentUser.id,
      this.currentChat.id
    );

    const container = document.getElementById("messagesContainer");
    container.innerHTML = "";

    messages.forEach((msg) => {
      const messageDiv = document.createElement("div");
      messageDiv.className =
        msg.senderId === currentUser.id ? "message sent" : "message received";

      messageDiv.innerHTML = `
                <div class="message-bubble">
                    <div>${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
      container.appendChild(messageDiv);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  },

  setupMessageInput() {
    const input = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    sendBtn.addEventListener("click", () => this.sendMessage());
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });
  },

  sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (!text || !this.currentChat) return;

    const currentUser = Storage.getCurrentUser();
    const now = new Date();
    const time = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      text: text,
      time: time,
    };

    Storage.addMessage(currentUser.id, this.currentChat.id, message);

    input.value = "";
    this.loadMessages();
    this.loadChatList();
  },
};
