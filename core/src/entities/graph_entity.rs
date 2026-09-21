use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::enums::entity_type::EntityType;

#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GraphNode {
    pub id: Uuid,
    pub entity_id: Uuid,

    pub x: f32,
    pub y: f32,
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GraphEdge {
    pub id: Uuid,
    pub source: Uuid,
    pub target: Uuid,
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GraphEntity {
    pub id: Uuid,
    pub project_id: Uuid,
    pub user_id: Uuid,
    pub entity_type: EntityType,

    pub title: String,

    pub nodes: Vec<GraphNode>,
    pub edges: Vec<GraphEdge>,

    pub is_deleted: bool,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl GraphEntity {
    pub fn new(
        project_id: Uuid,
        user_id: Uuid,
        title: String,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            project_id,
            user_id,
            entity_type: EntityType::Graph,

            title,

            nodes: Vec::new(),
            edges: Vec::new(),

            is_deleted: false,

            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}