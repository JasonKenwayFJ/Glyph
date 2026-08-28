use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::traits::storable::Storable;
//TODO: Добавить User в TS Enum, и перетащить Project на index[1]
#[derive(Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum EntityType{
    User,
    Project,
    Card,
    Document,
    Note,
    Audio,
    Video,
    Graph,
    Table,
    List,
    Task,
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Entity {
    pub(crate) id: Uuid,
    project_id: Uuid,
    title: String,
    description: String,
    content: String,
    image_path: String,
    pub entity_type: EntityType,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
    categories: Vec<Characteristic>,
    tags: Vec<Characteristic>,
    extra_fields: Vec<ExtraField>,
}
impl Entity {
    pub fn new(
        project_id: Uuid,
        title: &str,
        description: &str,
        content: &str,
        image_path: &str,
        entity_type: EntityType,
        categories: Vec<Characteristic>,
        tags: Vec<Characteristic>,
        extra_fields: Vec<ExtraField>,
    ) -> Self{
        let now = Utc::now();
        Entity {
            id: Uuid::new_v4(),
            project_id,
            title: title.to_string(),
            description: description.to_string(),
            content: content.to_string(),
            image_path: image_path.to_string(),
            entity_type,
            created_at: now,
            updated_at: now,
            categories,
            tags,
            extra_fields,
        }
    }
}
impl Storable for Entity{
    fn storage_id(&self) -> Uuid{
        self.id
    }
    fn entity_type(&self) -> EntityType{
        self.entity_type
    }
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Characteristic {
    id: Uuid,
    title: String,
}
impl Characteristic {
    pub fn new(id: Uuid, title: &str) -> Self {
        Characteristic {
            id,
            title: title.to_string(),
        }
    }
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExtraField {
    id: Uuid,
    title: String,
}
impl ExtraField {
    pub fn new(id: Uuid, title: &str) -> Self {
        ExtraField {
            id,
            title: title.to_string(),
        }
    }
}