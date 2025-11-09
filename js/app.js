const App = {
  init() {
    console.log("🚀 Messenger App Starting...");

    // Khởi tạo các module
    Auth.init();

    // Setup tabs
    this.setupTabs();

    // Kiểm tra user đã login
    const currentUser = Storage.getCurrentUser();
    if (currentUser) {
      switchScreen("chatScreen");
      this.loadUserData();
    }

    console.log("✅ App Ready!");
  },

  setupTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetTab = tab.getAttribute("data-tab");

        // Update active tab
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Update active panel
        document.querySelectorAll(".tab-panel").forEach((panel) => {
          panel.classList.remove("active");
        });
        document.getElementById(targetTab + "Tab").classList.add("active");
      });
    });
  },

  loadUserData() {
    const currentUser = Storage.getCurrentUser();
    if (!currentUser) return;

    // Update user info in sidebar
    document.getElementById("currentUserName").textContent = currentUser.name;
    document.getElementById("currentUserAvatar").textContent =
      currentUser.avatar;

    // Load các phần khác
    Chat.init();
    Friends.init();
  },
};

// Utility Functions
function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Start app when DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
