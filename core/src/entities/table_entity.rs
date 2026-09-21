use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::enums::entity_type::EntityType;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TableColumn {
    pub id: Uuid,
    pub name: String,
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TableRow {
    pub id: Uuid,
    pub cells: Vec<String>,
}
#[derive(Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Table{
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub entity_type: EntityType,

    pub title: String,

    pub columns: Vec<TableColumn>,
    pub rows: Vec<TableRow>,

    pub is_pending: bool,
    pub is_deleted: bool,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
impl Table {
    pub fn new(
        project_id: Uuid,
        user_id: Uuid,
        title: String,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            project_id,
            user_id,
            entity_type: EntityType::Table,

            title,

            columns: Vec::new(),
            rows: Vec::new(),

            is_pending: false,
            is_deleted: false,

            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}