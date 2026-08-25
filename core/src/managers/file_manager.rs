use std::fs;
use std::path::{Path, PathBuf};
use std::sync::LazyLock;
use crate::entities::entity::Entity;

const DOCUMENTS: LazyLock<PathBuf> = LazyLock::new(|| {
    dirs::document_dir().expect("Desktop not found")
});
pub fn load_entities() -> Option<Vec<Entity>>{
    let storage = DOCUMENTS.join("Glyph Storage");

    if !storage.exists() {
        fs::create_dir(&storage).unwrap();
    }

    let entity_folder = storage.join("Entities");

    if !entity_folder.exists() {
        fs::create_dir_all(&entity_folder).unwrap();
    }

    let is_empty = fs::read_dir(&entity_folder)
        .expect("Could not read Entities")
        .next()
        .is_none();
    
    if (!is_empty){
        let entries = fs::read_dir(entity_folder).expect("");
        let mut cards : Vec<Entity> = Vec::new();

        for entry in entries {
            let entry = entry.expect("could not read entry");
            let path = entry.path();


            if path.is_file(){
                let content = fs::read_to_string(&path)
                    .expect("Could not read file");

                let card: Entity = serde_json::from_str(&content)
                    .expect("Could not deserialize card");
                cards.push(card)
            }
        }
        Some(cards)
    }
    else{
        None
    }
}

fn has_files(folder: &Path) -> std::io::Result<bool> {
    Ok(fs::read_dir(folder)?
        .any(|entry| entry.expect("REASON").file_type().expect("REASON").is_file()))
}