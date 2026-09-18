use uuid::Uuid;
use crate::enums::entity_type::EntityType;

pub trait Storable{
    fn file_name(&self) -> String;
    fn storage_id(&self) -> Uuid;
    fn entity_type(&self) -> EntityType;
    fn file_path(&self) -> String{
        format!("{}.glh", self.file_name())
    }
}