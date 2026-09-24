 use std::path::PathBuf;
use uuid::Uuid;
use crate::enums::entity_type::EntityType;
use crate::traits::trashable::Trashable;

#[typetag::serde(tag = "type")]
pub trait EntityLike:Send + Sync + Trashable{
    fn id(&self) -> Uuid;
    fn user_id(&self) -> Uuid;
    fn project_id(&self) -> Uuid;
    fn entity_type(&self) -> EntityType;
    fn thumbnail(&self) -> PathBuf;
    fn file_name(&self) -> String;
    fn clone_box(&self) -> Box<dyn EntityLike>;
}


// это даёт Box<dyn EntityLike> обычный .clone()
impl Clone for Box<dyn EntityLike> {
    fn clone(&self) -> Box<dyn EntityLike> {
        self.clone_box()
    }
}

