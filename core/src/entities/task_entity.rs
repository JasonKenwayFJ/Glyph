use std::path::PathBuf;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::entities::entity::EntityType;
use crate::traits::entity::EntityLike;

#[derive(Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum TaskStatus{
    Todo,
    InProgress,
    Blocked,
    InReview,
    Done,
    Cancelled,
}
#[derive(Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum Priority {
    Low,
    Medium,
    High,
    Critical,
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Task{
    pub id: Uuid,
    pub user_id: Uuid,
    pub project_id: Uuid,
    pub parent_task_id: Option<Uuid>,
    pub thumbnail: Option<PathBuf>,
    pub entity_type: EntityType,
    pub title: String,
    pub description: String,

    pub status: TaskStatus,

    pub is_pending: bool,
    pub is_deleted: bool,

    pub priority: Priority,
    pub position: i32,
    pub estimated_minutes: Option<i32>,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,

}
impl Task {
    pub fn new(
        user_id: Uuid,
        project_id: Uuid,
        title: String,
        description: String,
        priority: Priority,
        parent_task_id: Option<Uuid>,
        thumbnail: Option<PathBuf>,
    ) -> Self {
        let now = Utc::now();

        Self {
            id: Uuid::new_v4(),
            user_id,
            project_id,
            entity_type: EntityType::Task,
            parent_task_id,
            thumbnail,
            title,
            description,

            status: TaskStatus::Todo,

            is_pending: false,
            is_deleted: false,

            priority,
            position: 0,
            estimated_minutes: None,

            created_at: now,
            updated_at: now,
            deleted_at: None,
            completed_at: None,
        }
    }
}
impl EntityLike for Task {
    fn id(&self) -> Uuid { self.id }
    fn user_id(&self) -> Uuid { self.user_id }

    fn project_id(&self) -> Uuid { self.project_id }

    fn entity_type(&self) -> EntityType { self.entity_type }

    fn thumbnail(&self) -> PathBuf { self.thumbnail.clone().unwrap_or_else(|| PathBuf::from("public/glyph-default-cover.svg")) }
}