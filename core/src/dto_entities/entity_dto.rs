use serde::Deserialize;
use uuid::Uuid;
use crate::entities::entity::{Characteristic, Entity, EntityType, ExtraField};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EntityDto {
    project_id: Uuid,
    entity_type: EntityType,
    title: String,
    description: String,
    content: String,
    image_path: String,
    categories: Vec<Characteristic>,
    tags: Vec<Characteristic>,
    extra_fields: Vec<ExtraField>
}

impl EntityDto {
    pub fn new(
        project_id: Uuid,
        entity_type: EntityType,
        title: String,
        description: String,
        content: String,
        image_path: String,
        categories: Vec<Characteristic>,
        tags: Vec<Characteristic>,
        extra_fields: Vec<ExtraField>,
    ) -> Self {
        Self {
            project_id,
            entity_type,
            title,
            description,
            content,
            image_path,
            categories,
            tags,
            extra_fields,
        }
    }

    pub fn get_entity(self) -> Entity{
        Entity::new(
            self.project_id,
            &self.title,
            &self.description,
            &self.content,
            &self.image_path,
            self.entity_type,
            self.categories,
            self.tags,
            self.extra_fields,
            false
        )
    }
}