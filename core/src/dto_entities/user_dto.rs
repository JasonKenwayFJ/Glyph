use serde::{Deserialize, Serialize};
use crate::entities::helpers::data_object::DataObject;
use crate::entities::user_entity::User;
use crate::enums::entity::Entity;
use crate::enums::source::Source;
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserDto{
    pub user_name: String,
    pub email: String,
    pub image_source: Option<Source>,
    pub thumbnail: Option<String>,
    pub entity_type: Entity,
}

impl DataObject for UserDto{
    type Entity = User;

    fn get_title(&self) -> String {self.user_name.clone()}

    fn get_type(&self) -> Entity {self.entity_type.clone()}

    fn get_entity(&self) -> Self::Entity {
        User::from(self)
    }
}