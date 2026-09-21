use std::path::PathBuf;
use uuid::Uuid;
use crate::enums::entity_type::EntityType;
#[typetag::serde(tag = "type")]
pub trait EntityLike{
    fn id(&self) -> Uuid;
    fn user_id(&self) -> Uuid;
    fn project_id(&self) -> Uuid;
    fn entity_type(&self) -> EntityType;
    fn thumbnail(&self) -> PathBuf;
    fn clone_box(&self) -> Box<dyn EntityLike>;
}



// это даёт Box<dyn EntityLike> обычный .clone()
impl Clone for Box<dyn EntityLike> {
    fn clone(&self) -> Box<dyn EntityLike> {
        self.clone_box()
    }
}

