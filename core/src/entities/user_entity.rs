use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: Uuid,
    pub token: String,
    pub username: String,
    pub email: String,
    pub image_path: String,
    pub created_at: DateTime<Utc>,
    pub user_config: String,
    pub is_verified: bool,
    pub is_subscribed: bool,
    pub subscription_expires_at: DateTime<Utc>
}

impl User {
    pub fn new(
        id: Option<Uuid>,
        token: Option<String>,
        username: String,
        email: String,
        image_path: Option<String>,
    ) -> Self {

        User {
            id : id.unwrap_or_else(|| Uuid::new_v4()),
            token: token.unwrap_or_else(|| String::new()),
            username,
            email,
            image_path : image_path.unwrap_or_else(|| String::new()),
            created_at: Utc::now(),
            user_config: String::new(),
            is_verified: false,
            is_subscribed: false,
            subscription_expires_at: Utc::now(),
        }
    }
}