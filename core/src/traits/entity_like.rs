use std::path::PathBuf;
use uuid::Uuid;

use crate::enums::entity_type::EntityType;
use crate::traits::trashable::Trashable;

#[typetag::serde(tag = "type")]
pub trait EntityLike: Send + Sync + Trashable {
    fn entity_type(&self) -> EntityType;
    fn id(&self) -> Uuid;
    fn user_id(&self) -> Uuid;
    fn project_id(&self) -> Uuid;
    fn thumbnail(&self) -> PathBuf;
    fn file_name(&self) -> String;
    fn get_path(&self) -> PathBuf;
    fn set_path(&mut self, path: PathBuf) -> Result<(), String>;
    fn clone_box(&self) -> Box<dyn EntityLike>;
}

impl Clone for Box<dyn EntityLike> {
    fn clone(&self) -> Box<dyn EntityLike> {
        self.clone_box()
    }
}
