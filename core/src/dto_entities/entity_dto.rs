use serde::Deserialize;
use uuid::Uuid;
use crate::entities::entity::{Characteristic, Entity, EntityType, ExtraField};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EntityDto {
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

    pub fn get_entity(self, project_id: Uuid) -> Entity{
        Entity::new(
            project_id,
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