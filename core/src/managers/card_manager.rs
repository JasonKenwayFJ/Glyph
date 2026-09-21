use std::sync::Mutex;
use crate::entities::card_entity::Card;

pub struct CardManager{
    cards: Mutex<Vec<Card>>,
}

impl CardManager {
    pub fn new() -> CardManager {
        CardManager{cards: Mutex::new(Vec::new())}
    }
    
    pub fn get_cards(&self) -> Vec<Card> {
        self.cards.lock().unwrap().iter().cloned().collect()
    }
    pub fn add_card(&self, card: Card) {
        self.cards.lock().unwrap().push(card);
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