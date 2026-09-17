use chrono::{DateTime, Utc};

pub trait Trashable {
    fn is_deleted(&self) -> bool;
    fn deleted_at(&self) -> Option<DateTime<Utc>>;
    fn move_to_trash(&mut self);
    fn restore(&mut self);
}