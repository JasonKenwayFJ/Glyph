use std::path::PathBuf;
use serde::Deserialize;
use uuid::Uuid;
use crate::entities::document_entity::{Characteristic, Document, ExtraField};
use crate::enums::entity_type::EntityType;
use crate::enums::source::Source;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentDto {
    pub title: String,
    pub description: String,
    pub content: String,
    pub thumbnail_source: Source,
    pub thumbnail: Option<PathBuf>,
    pub entity_type: EntityType,
    pub categories: Vec<Characteristic>,
    pub tags: Vec<Characteristic>,
    pub extra_fields: Vec<ExtraField>,
    pub is_pending: bool,
}

impl DocumentDto {
    pub fn into_entity(self, project_id: Uuid, user_id: Uuid) -> Document {
        Document::new(
            project_id,
            user_id,
            &self.title,
            &self.description,
            &self.content,
            self.thumbnail_source,
            self.thumbnail,
            self.entity_type,
            self.categories,
            self.tags,
            self.extra_fields,
            self.is_pending,
        )
    }
}