use crate::enums::entity::Entity;

pub trait DataObject {
    type Entity;
    fn get_title(&self) -> String;
    fn get_type(&self) -> Entity;
    fn get_entity(&self) -> Self::Entity;
}
