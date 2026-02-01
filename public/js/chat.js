import { input } from "./input/index.js";

export function initChat(socket) {
    const chatContainer = document.getElementById("chat-container");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const chatNotifications = document.getElementById("chat-notifications");

    let isChatOpen = false;

    // Toggle chat with 'T'
    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "t" && !isChatOpen) {
            e.preventDefault();
            openChat();
        } else if (e.key === "Escape" && isChatOpen) {
            closeChat();
        }
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const message = chatInput.value.trim();
            if (message) {
                socket.emit("chatMessage", message);
            }
            chatInput.value = "";
            closeChat();
        }
    });

    function openChat() {
        isChatOpen = true;
        input.isChatting = true;
        chatContainer.classList.add("active");
        chatInput.focus();
        
        // Reset movement inputs to prevent sliding while chatting
        input.up = input.down = input.left = input.right = false;
    }

    function closeChat() {
        isChatOpen = false;
        input.isChatting = false;
        chatContainer.classList.remove("active");
        chatInput.blur();
        chatInput.value = "";
    }

    socket.on("chatMessage", (data) => {
        // Add to chat history
        const msgDiv = document.createElement("div");
        msgDiv.className = "msg";
        msgDiv.innerHTML = `<span class="msg-author">[${data.username}]</span>${data.message}`;
        chatMessages.appendChild(msgDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Auto-hide message after 10 seconds (Minecraft style)
        setTimeout(() => {
            if (!isChatOpen) {
                msgDiv.style.opacity = "0";
                msgDiv.style.transition = "opacity 2s ease";
                setTimeout(() => msgDiv.remove(), 2000);
            }
        }, 10000);

        // Show notification at the top if chat is closed
        if (!isChatOpen) {
            showNotification(data.username, data.message);
        }
    });

    function showNotification(author, message) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = `${author}: ${message}`;
        
        chatNotifications.appendChild(notification);
        
        // Remove after animation finishes
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}
