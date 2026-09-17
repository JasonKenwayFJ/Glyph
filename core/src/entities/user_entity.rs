use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::entities::user_config::UserConfig;
use crate::enums::entity_type::EntityType;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: Uuid,
    pub token: Option<String>,
    pub entity_type: EntityType,
    pub username: String,
    pub email: String,
    pub image_path: String,
    pub created_at: DateTime<Utc>,
    pub user_config: String,
    pub is_verified: bool,
    pub is_subscribed: bool,
    pub subscription_expires_at: DateTime<Utc>
}
impl Default for User {
    fn default() -> Self {
        let config = UserConfig::default();

        Self {
            id: Uuid::new_v4(),
            token: None,
            entity_type: EntityType::User,
            username: "Jabbo".to_string(),
            email: "example@gmail.com".to_string(),
            image_path: "/glyph-default-userpfp.png".to_string(),
            created_at: Utc::now(),
            user_config: serde_json::to_string(&config).unwrap(),
            is_verified: false,
            is_subscribed: false,
            subscription_expires_at: Default::default(),
        }
    }
}
impl User {
    
    pub fn new(
        id: Uuid,
        token: Option<String>,
        username: String,
        email: String,
        image_path: Option<String>,
    ) -> Self {

        User {
            id,
            token: Some(token.unwrap_or_else(|| String::new())),
            entity_type: EntityType::User,
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
