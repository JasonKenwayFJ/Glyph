use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, PartialEq, Serialize, Deserialize, Default)]
pub enum EntityType{
    #[default]
    User,
    Project,
    Card,
    Document,
    Note,
    Audio,
    Video,
    Graph,
    Table,
    Task,
}