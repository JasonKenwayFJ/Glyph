use uuid::Uuid;
use crate::entities::entity::EntityType;

pub trait Storable{
    fn storage_id(&self) -> Uuid;
    fn entity_type(&self) -> EntityType;
    fn file_name(&self) -> String{
        format!("{}.glh", self.storage_id())
    }
}