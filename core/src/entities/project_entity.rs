use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub image_path: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub weight: i32,
}

impl Project {
    pub fn new(title: &str, description: &str, image_path: &str) -> Self {
        let now = Utc::now();
        Project {
            id: Uuid::new_v4(),
            title: title.to_string(),
            description: description.to_string(),
            image_path: image_path.to_string(),
            created_at: now,
            updated_at: now,
            weight: 0,
        }
    }
}