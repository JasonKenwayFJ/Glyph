use uuid::Uuid;
use crate::entities::helpers::dto::DataObject;
use crate::enums::entity::Entity;
use crate::enums::entity_type::EntityType;
use crate::enums::source::Source;
use crate::Project;

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