use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::entities::entity::EntityType;
use crate::traits::storable::Storable;
use crate::managers::user_manager::UserManager;
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub id: Uuid,
    pub user_id: Uuid,
    pub title: String,
    pub entity_type: EntityType,
    pub description: String,
    pub image_path: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub weight: i32,
}

impl Project {

    pub fn new(user_id: Uuid, title: &str, description: &str, image_path: &str) -> Self {
        let now = Utc::now();
        Project {
            id: Uuid::new_v4(),
            user_id,
            title: title.to_string(),
            entity_type: EntityType::Project,
            description: description.to_string(),
            image_path: image_path.to_string(),
            created_at: now,
            updated_at: now,
            weight: 0,
        }
    }
}
impl Storable for Project{
    fn storage_id(&self) -> Uuid{
        self.id
    }
    fn entity_type(&self) -> EntityType{
        self.entity_type
    }
}