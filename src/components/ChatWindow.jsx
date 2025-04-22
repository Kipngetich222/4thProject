const fetchMessages = async () => {
  try {
    const response = await axios.get(`/chat/${chatId}/messages`);
    setMessages(response.data);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

const sendMessage = async (message) => {
  try {
    await axios.post(`/chat/${chatId}/messages`, { content: message });
    fetchMessages();
  } catch (error) {
    console.error("Error sending message:", error);
  }
}; 