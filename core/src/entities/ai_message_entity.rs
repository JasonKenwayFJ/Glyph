use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub id: Uuid,
    pub message: String,
    pub is_from_user: bool,
}
impl ChatMessage {
    pub fn new(id: Option<Uuid>, message: String, is_from_user: bool) -> ChatMessage {
        let new_id = id.unwrap_or(Uuid::new_v4());

        ChatMessage {
            id: new_id,
            message,
            is_from_user,
        }
    }
}
#[derive(Serialize, Deserialize)]
pub struct ChatRequest {
    pub token: String,
    pub image: Option<Vec<u8>>,
    pub message: String,
    pub timestamp: DateTime<Utc>,
    pub language_code: String,
    pub target_language: Option<String>,
}
impl ChatRequest {
    pub fn new(
        image: Option<Vec<u8>>,
        message: String,
        token: String,
        language_code: String,
        target_language: Option<String>,
    ) -> Self {
        let now = Utc::now();
        ChatRequest {
            image,
            message,
            token,
            timestamp: now,
            language_code,
            target_language,
        }
    }
}
