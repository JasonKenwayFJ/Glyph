use uuid::Uuid;
use crate::enums::entity_type::EntityType;

pub trait Storable{
    fn storage_id(&self) -> Uuid;
    fn entity_type(&self) -> EntityType;
    fn file_name(&self) -> String{
        format!("{}.glh", self.storage_id())
    }
}