use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::entities::entity::EntityType;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub entity_type: EntityType,

    pub title: String,
    pub content: String,

    pub is_pending: bool,
    pub is_deleted: bool,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
impl Note {
    pub fn new(
        project_id: Uuid,
        user_id: Uuid,
        title: String,
        content: String,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            project_id,
            user_id,
            entity_type: EntityType::Note,

            title,
            content,

            is_pending: false,
            is_deleted: false,

            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}