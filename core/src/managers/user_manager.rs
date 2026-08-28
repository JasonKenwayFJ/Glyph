use std::sync::Mutex;
use uuid::Uuid;
use crate::entities::user_entity::User;

pub struct UserManager {
    user: Mutex<Option<String>>
}

impl UserManager {
    pub fn new() -> UserManager {
        UserManager {
            user: Mutex::new(None)
        }
    }

    pub fn get_user(&self) -> Option<String> {
        self.user.lock().unwrap().clone()
    }
    pub fn set_user(&self, user_id: &str) {
        self.user.lock().unwrap().replace(user_id.to_string());
    }
    pub fn quit(&self) {
        let mut user = self.user.lock().unwrap();
        *user = None;
    }
}