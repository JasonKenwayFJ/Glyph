pub mod deleter;
pub mod loader;
pub mod paths;
pub mod restorer;
pub mod writer;



#[cfg(test)]
mod tests {
    use std::env::temp_dir;
    use glyph_core::entities::card_entity::Card;
    use super::*;
    #[tokio::test]
    async fn test_writer() {
        let user = Card::default();
        let app_data_dir = temp_dir().join("Glyph");
        std::fs::create_dir_all(&app_data_dir).expect("Failed to create test directory");
        let result = writer::save_to_disk(&app_data_dir, &user).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_deleter() {
        // deleter::какая_то_функция();
    }

    #[tokio::test]
    async fn test_loader() {
        // loader::какая_то_функция();
    }


}