use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::enums::entity_type::EntityType;
use crate::traits::storable::Storable;
use crate::traits::trashable::Trashable;

#[derive(Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Trash{
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub entity_type: EntityType,
    pub trash_id: Uuid,
}
impl Trash {
    pub fn new(
         id: Uuid,
         project_id: Uuid,
         user_id: Uuid,
         trash_id: Uuid,
    ) -> Self{
        Self{
            id,
            project_id,
            user_id,
            entity_type: EntityType::Trash,
            trash_id,
        }
    }
}