use crate::enums::entity_type::EntityType;
use crate::enums::source::Source;
use crate::traits::entity::EntityLike;
use crate::traits::storable::Storable;
use crate::traits::trashable::Trashable;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Audio {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub entity_type: EntityType,

    pub title: String,
    pub file_path: String,
    pub audio_source: Source,

    pub thumbnail: Option<PathBuf>,
    pub duration: u64,

    pub codec: String,
    pub bitrate: u32,
    pub sample_rate: u32,
    pub channels: u8,

    pub is_pending: bool,
    pub is_deleted: bool,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

impl Audio {
    pub fn new(
        project_id: Uuid,
        user_id: Uuid,
        title: String,
        file_path: String,
        audio_source: Source) -> Self
    {
        Self {
            id: Uuid::new_v4(),
            project_id,
            user_id,
            entity_type: EntityType::Audio,
            title,
            file_path,
            audio_source,
            thumbnail: None,
            duration: 0,
            codec: String::new(),
            bitrate: 0,
            sample_rate: 0,
            channels: 0,
            is_pending: false,
            is_deleted: false,
            created_at: Utc::now(),
            updated_at: Utc::now(),
            deleted_at: None,
        }
    }
}
impl EntityLike for Audio{
    fn id(&self) -> Uuid { self.id }
    fn user_id(&self) -> Uuid { self.user_id }

    fn project_id(&self) -> Uuid { self.project_id }

    fn entity_type(&self) -> EntityType { self.entity_type }

    fn thumbnail(&self) -> PathBuf { self.thumbnail.clone().unwrap_or_else(|| PathBuf::from("public/glyph-default-cover.svg")) }
}
impl Storable for Audio{
    fn file_name(&self) -> String {self.title.clone()}

    fn storage_id(&self) -> Uuid{
        self.id
    }
    fn entity_type(&self) -> EntityType{
        self.entity_type
    }
}
impl Trashable for Audio{
    fn trash_id(&self) -> Uuid {
        self.id
    }

    fn trash_project_id(&self) -> Uuid {
        self.project_id
    }

    fn trash_user_id(&self) -> Uuid {
        self.user_id
    }

    fn is_deleted(&self) -> bool {self.is_deleted}

    fn deleted_at(&self) -> Option<DateTime<Utc>> {self.deleted_at}

    fn move_to_trash(&mut self) {
        self.is_deleted = true;
        self.deleted_at = Some(Utc::now());
    }

    fn restore(&mut self) {
        self.is_deleted = false;
        self.deleted_at = None;
    }
}