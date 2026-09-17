use chrono::{DateTime, Utc};
use uuid::Uuid;

pub trait Trashable {
    fn trash_id(&self) -> Uuid;
    fn trash_project_id(&self) -> Uuid;
    fn trash_user_id(&self) -> Uuid;
    fn is_deleted(&self) -> bool;
    fn deleted_at(&self) -> Option<DateTime<Utc>>;
    fn move_to_trash(&mut self);
    fn restore(&mut self);
}