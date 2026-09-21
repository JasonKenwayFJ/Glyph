use std::sync::Mutex;
use crate::entities::card_entity::Card;
use crate::entities::document_entity::Document;

pub struct DocumentStorage{
    documents: Mutex<Vec<Document>>,
}

impl DocumentStorage {
    pub fn new() -> DocumentStorage {
        DocumentStorage{documents: Mutex::new(Vec::new())}
    }

    pub fn get_cards(&self) -> Vec<Card> {
        self.documents.lock().unwrap().iter().cloned().collect()
    }
    pub fn add_document(&self, document: Card) {
        self.documents.lock().unwrap().push(card);
    }
    pub fn update_card(&self, card: &Card){
        let mut cards = self.cards.lock().unwrap();
        if let Some(index) = cards.iter().position(|card| *card == *card) {
            cards[index] = card.clone();
        }
    }
    pub fn remove_add(&self, card: Card){
        self.cards.lock().unwrap().retain(|x| x != &card);
    }
}