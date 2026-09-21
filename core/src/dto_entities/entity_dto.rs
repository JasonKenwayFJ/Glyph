use crate::enums::entity::{Characteristic, Entity, ExtraField};
use crate::enums::entity_type::EntityType;
use crate::enums::source::Source;
use serde::Deserialize;
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EntityDto {
    entity_type: EntityType,
    title: String,
    description: String,
    content: String,
    thumbnail_source: Source,
    thumbnail: Option<PathBuf>,
    categories: Vec<Characteristic>,
    tags: Vec<Characteristic>,
    extra_fields: Vec<ExtraField>
}

impl EntityDto {
    pub fn new(
        entity_type: EntityType,
        title: String,
        description: String,
        content: String,
        thumbnail_source: Source,
        thumbnail: Option<PathBuf>,
        categories: Vec<Characteristic>,
        tags: Vec<Characteristic>,
        extra_fields: Vec<ExtraField>,
    ) -> Self {
        Self {
            entity_type,
            title,
            description,
            content,
            thumbnail_source,
            thumbnail,
            categories,
            tags,
            extra_fields,
        }
    }

    pub fn get_entity(self, project_id: Uuid, user_id: Uuid) -> Entity {
        Entity::new(
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
            false,
        )
    }
}