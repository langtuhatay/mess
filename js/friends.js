const Friends = {
  init() {
    this.setupSearch();
    this.loadFriends();
    this.loadFriendRequests();
  },

  setupSearch() {
    document.getElementById("searchInput").addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      this.filterChats(query);
    });
  },

  filterChats(query) {
    const chatItems = document.querySelectorAll(".chat-item");
    chatItems.forEach((item) => {
      const name = item
        .querySelector(".chat-item-name")
        .textContent.toLowerCase();
      if (name.includes(query)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  },

  loadFriends() {
    const currentUser = Storage.getCurrentUser();
    if (!currentUser) return;

    const users = Storage.getUsers();
    const nonFriends = users.filter(
      (u) => u.id !== currentUser.id && !currentUser.friends.includes(u.id)
    );

    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML = "";

    if (nonFriends.length === 0) {
      friendsList.innerHTML =
        '<p style="padding: 20px; text-align: center; color: #65676b;">Không có người dùng mới</p>';
      return;
    }

    nonFriends.forEach((user) => {
      const friendItem = document.createElement("div");
      friendItem.className = "friend-item";
      friendItem.innerHTML = `
                <div class="friend-info">
                    <div class="friend-avatar">${user.avatar}</div>
                    <div class="friend-details">
                        <h4>${user.name}</h4>
                        <p>${user.email}</p>
                    </div>
                </div>
                <button class="add-friend-btn" onclick="Friends.sendRequest(${user.id})">
                    Thêm bạn bè
                </button>
            `;
      friendsList.appendChild(friendItem);
    });
  },

  sendRequest(userId) {
    const currentUser = Storage.getCurrentUser();
    Storage.addFriendRequest(currentUser.id, userId);
    showToast("Đã gửi lời mời kết bạn!");
    this.loadFriendRequests();
  },

  loadFriendRequests() {
    const currentUser = Storage.getCurrentUser();
    if (!currentUser) return;

    const requests = Storage.getFriendRequests();
    const myRequests = requests.filter((r) => r.to === currentUser.id);

    const requestsList = document.getElementById("requestsList");
    requestsList.innerHTML = "";

    if (myRequests.length === 0) {
      requestsList.innerHTML =
        '<p style="padding: 20px; text-align: center; color: #65676b;">Không có lời mời nào</p>';
      return;
    }

    const users = Storage.getUsers();
    myRequests.forEach((request) => {
      const requester = users.find((u) => u.id === request.from);
      if (!requester) return;

      const requestItem = document.createElement("div");
      requestItem.className = "friend-item";
      requestItem.innerHTML = `
                <div class="friend-info">
                    <div class="friend-avatar">${requester.avatar}</div>
                    <div class="friend-details">
                        <h4>${requester.name}</h4>
                        <p>Muốn kết bạn với bạn</p>
                    </div>
                </div>
                <button class="add-friend-btn" onclick="Friends.acceptRequest(${requester.id})">
                    Chấp nhận
                </button>
            `;
      requestsList.appendChild(requestItem);
    });
  },

  acceptRequest(requesterId) {
    const currentUser = Storage.getCurrentUser();
    const users = Storage.getUsers();

    // Cập nhật friends cho cả 2 user
    const currentUserData = users.find((u) => u.id === currentUser.id);
    const requesterData = users.find((u) => u.id === requesterId);

    if (!currentUserData.friends.includes(requesterId)) {
      currentUserData.friends.push(requesterId);
    }
    if (!requesterData.friends.includes(currentUser.id)) {
      requesterData.friends.push(currentUser.id);
    }

    Storage.saveUsers(users);
    Storage.setCurrentUser(currentUserData);
    Storage.removeFriendRequest(requesterId, currentUser.id);

    showToast("Đã chấp nhận lời mời kết bạn!");
    this.loadFriendRequests();
    this.loadFriends();
    Chat.loadChatList();
  },
};
