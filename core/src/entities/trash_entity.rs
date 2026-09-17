use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::traits::trashable::Trashable;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Trash<T : Trashable>{
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub trash: T,
}
impl<T: Trashable> Trash<T> {
    pub fn new(data: T) -> Self{
        Self{
            id: data.trash_id(),
            project_id: data.trash_project_id(),
            user_id: data.trash_user_id(),
            trash: data,
        }
    }
}