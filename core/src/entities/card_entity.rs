use std::path::PathBuf;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::entities::entity::{Characteristic, Entity, ExtraField};
use crate::enums::entity_type::EntityType;
use crate::enums::source::Source;
use crate::traits::entity::EntityLike;
use crate::traits::storable::Storable;
use crate::traits::trashable::Trashable;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Card {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub title: String,
    pub description: String,
    pub content: String,
    pub thumbnail_source: Source,
    pub thumbnail: Option<PathBuf>,
    pub entity_type: EntityType,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub categories: Vec<Characteristic>,
    pub tags: Vec<Characteristic>,
    pub extra_fields: Vec<ExtraField>,
    pub is_pending: bool,
    pub is_deleted: bool,
    pub deleted_at: Option<DateTime<Utc>>,
}

impl Card {
    pub fn new(
        project_id: Uuid,
        user_id: Uuid,
        title: &str,
        description: &str,
        content: &str,
        thumbnail_source: Source,
        thumbnail: Option<PathBuf>,
        entity_type: EntityType,
        categories: Vec<Characteristic>,
        tags: Vec<Characteristic>,
        extra_fields: Vec<ExtraField>,
        is_pending: bool
    ) -> Self {
        let now = Utc::now();
        Card {
            id: Uuid::new_v4(),
            project_id,
            user_id,
            title: title.to_string(),
            description: description.to_string(),
            content: content.to_string(),
            thumbnail_source,
            thumbnail,
            entity_type,
            created_at: now,
            updated_at: now,
            categories,
            tags,
            extra_fields,
            is_pending,
            is_deleted: false,
            deleted_at: None,
        }
    }
}
    impl EntityLike for Card{
        fn id(&self) -> Uuid { self.id }
        fn user_id(&self) -> Uuid { self.user_id }

        fn project_id(&self) -> Uuid { self.project_id }

        fn entity_type(&self) -> EntityType { self.entity_type }

        fn thumbnail(&self) -> PathBuf { self.thumbnail.clone().unwrap_or_else(|| PathBuf::from("public/glyph-default-cover.svg")) }
    }

    impl Storable for Card{
        fn file_name(&self) -> String {self.title.clone()}

        fn storage_id(&self) -> Uuid{
            self.id
        }
        fn entity_type(&self) -> EntityType{
            self.entity_type
        }
    }
    impl Trashable for Card{
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