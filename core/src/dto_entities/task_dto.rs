use std::path::PathBuf;
use serde::Deserialize;
use uuid::Uuid;
use crate::entities::task_entity::{Priority, Task};
use crate::enums::entity_type::EntityType;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskDto {
    pub id: Uuid,
    pub parent_task_id: Option<Uuid>,
    pub thumbnail: Option<PathBuf>,
    pub entity_type: EntityType,
    pub title: String,
    pub description: String,
    pub priority: Priority,
}

impl TaskDto {
    pub fn into_entity(self, project_id: Uuid, user_id: Uuid) -> Task {
        Task::new(
            user_id,
            project_id,
            self.title,
            self.description,
            self.priority,
            self.parent_task_id,
            self.thumbnail)
    }
}