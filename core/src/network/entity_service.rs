use crate::entities::entity::{Entity, EntityType};
use crate::network::api_client::ApiClient;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

fn define_path(entity: &Entity) -> String {
    match entity.entity_type {
        EntityType::Card => "api/cards/".parse().unwrap(),
        EntityType::Document => "api/document/".parse().unwrap(),
    }
}
fn define_entity(entity_type: EntityType) -> String {
    match entity_type{
        EntityType::Document => "api/document/".parse().unwrap(),
        EntityType::Card => "api/cards/".parse().unwrap(),
    }
}

pub async fn get_entities<Res>(client:&ApiClient, entity_type: EntityType)
where 
    Res:serde::de::DeserializeOwned,{
    let url = format!("{}getall", define_entity(entity_type));
    client.get::<Res>(&url).await.expect("TODO: panic message");
}

pub async fn create_entity<Res>(client: &ApiClient, entity: &Entity)
where
    Res: serde::de::DeserializeOwned,{
    let url = format!("{}create", define_path(&entity));
    client.post::<Entity, Res>(&url, entity).await.expect("TODO: panic message");
}

pub async fn update_entity<Res>(client: &ApiClient, entity: &Entity)
where
    Res: serde::de::DeserializeOwned,{
    let url = format!("{}update", define_path(&entity));
    client.post::<Entity,Res>(&url, entity).await.expect("TODO: panic message");
}

pub async fn delete_entity<Res>(entity: &Entity) {
    let url = format!("{}delete/{}", define_path(&entity), entity.id);
}
pub async fn load_entities<Res>(client: &ApiClient, r#type: EntityType)
where
    Res: serde::de::DeserializeOwned,{
    let url;
    match r#type {
        EntityType::Card => url = "api/card/",
        EntityType::Document => url = "api/document/"
    }
    client.get::<Res>(url).await.expect("TODO: panic message");
}

