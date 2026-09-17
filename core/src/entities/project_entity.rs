use std::path::PathBuf;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::enums::entity_type::EntityType;
use crate::traits::entity::EntityLike;
use crate::traits::storable::Storable;
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub id: Uuid,
    pub user_id: Uuid,
    pub title: String,
    pub entity_type: EntityType,
    pub description: String,
    pub thumbnail: Option<PathBuf>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub weight: i32,
    #[serde(default)]
    pub is_pending: bool,
    #[serde(default)]
    pub is_deleted: bool,
    deleted_at: Option<DateTime<Utc>>,
}

impl Project {
    pub fn new(
        user_id: Uuid,
        title: &str,
        description: &str,
        thumbnail: Option<PathBuf>,
        is_pending: bool) -> Self {
        let now = Utc::now();
        Project {
            id: Uuid::new_v4(),
            user_id,
            title: title.to_string(),
            entity_type: EntityType::Project,
            description: description.to_string(),
            thumbnail,
            created_at: now,
            updated_at: now,
            weight: 0,
            is_pending,
            is_deleted: false,
            deleted_at: None,
        }
        
    }
}
impl EntityLike for Project{
    fn id(&self) -> Uuid {self.id}
    fn user_id(&self) -> Uuid {self.user_id}
    fn project_id(&self) -> Uuid {self.id}
    fn entity_type(&self) -> EntityType {self.entity_type}
    fn thumbnail(&self) -> PathBuf { self.thumbnail.clone().unwrap_or_else(|| PathBuf::from("public/glyph-default-cover.svg")) }

}
impl Storable for Project{
    fn storage_id(&self) -> Uuid{
        self.id
    }
    fn entity_type(&self) -> EntityType{
        self.entity_type
    }
}
