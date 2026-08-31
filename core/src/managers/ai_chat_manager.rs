use tokio::sync::Mutex;
use crate::entities::ai_message_entity::ChatMessage;

pub struct AiChatManager{
    messages: Mutex<Option<Vec<ChatMessage>>>
}
impl AiChatManager {
    pub fn new() -> AiChatManager {
        AiChatManager{
            messages: Mutex::new(None)
        }
    }

    pub async fn get_messages(&self) -> Option<Vec<ChatMessage>> {
        self.messages.lock().await.clone()
    }
    pub async fn add_message(&self, message: ChatMessage) {
        if let Some(messages) = self.messages.lock().await.as_mut(){
            messages.push(message);
        }
    }
}