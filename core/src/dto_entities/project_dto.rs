use serde::Deserialize;
use uuid::Uuid;
use crate::entities::helpers::dto::DataObject;
use crate::enums::entity::Entity;
use crate::enums::entity_type::EntityType;
use crate::enums::source::Source;
use crate::Project;

#[derive(Deserialize)]
pub struct ProjectDto{
    pub title: String,
    pub description: String,
    pub image_source: Option<Source>,
    pub thumbnail: Option<String>,
    pub entity_type: Entity
}
impl ProjectDto {
    pub fn new (
        title: String,
        description: String,
        image_source: Option<Source>,
        thumbnail: Option<String>,
        entity_type: Entity
    ) -> Self{
        ProjectDto{
            title,
            description,
            image_source,
            thumbnail,
            entity_type
        }
    }
}
impl DataObject for ProjectDto {
    type Entity = Project;

    fn get_title(&self) -> String {
        self.title.clone()
    }

    fn get_type(&self) -> Entity {
        self.entity_type.clone()
    }

    fn get_entity(&self) -> Self::Entity {
        Project::from(self)
    }
}

// project_dto.rs
impl ProjectDto {
    pub fn into_entity(self, user_id: Uuid) -> Project {
        Project {
            id: Uuid::new_v4(),
            user_id,
            title: self.title,
            entity_type: Default::default(),
            description: "".to_string(),
            thumbnail: None,
            created_at: Default::default(),
            updated_at: Default::default(),
            weight: 0,
            is_pending: false,
            is_deleted: false,
            deleted_at: None,
            cards: None,
            documents: None,
            tasks: None,
            notes: None,
            graphs: None,
            audios: None,
            videos: None,
            trash: None,
            image_source: None,
        }
    }
}