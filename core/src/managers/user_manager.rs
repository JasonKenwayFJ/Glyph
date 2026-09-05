use std::sync::Mutex;
use crate::entities::user_entity::User;

pub struct UserManager {
    user: Mutex<Option<User>>
}

impl UserManager {
    pub fn new() -> UserManager {
        UserManager {
            user: Mutex::new(None)
        }
    }

    pub fn get_user(&self) -> Option<User> {
        self.user.lock().unwrap().clone()
    }
    pub fn set_user(&self, user: User) {
        self.user.lock().unwrap().replace(user);
    }
    pub fn quit(&self) {
        let mut user = self.user.lock().unwrap();
        *user = None;
    }
}

