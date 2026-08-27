use crate::entities::entity::{Entity, EntityType};
use crate::network::api_client::{ApiClient, ApiResponse};


fn define_path(entity_type: EntityType) -> String {
    match entity_type{
        EntityType::Card => "api/cards/".parse().unwrap(),
        EntityType::Document => "api/document/".parse().unwrap(),
        EntityType::Project => "api/project/".parse().unwrap(),
        EntityType::Note => "api/note/".parse().unwrap(),
        EntityType::Audio => "api/audio/".parse().unwrap(),
        EntityType::Video => "api/video/".parse().unwrap(),
        EntityType::Task => "api/task/".parse().unwrap(),
        EntityType::Graph => "api/graph".parse().unwrap(),
        EntityType::Table => "api/table/".parse().unwrap(),
        EntityType::List => "api/list/".parse().unwrap(),
    }
}

pub async fn get_entities<Res>(client:&ApiClient, entity_type: EntityType) -> Result<ApiResponse<Res>, String>
where 
    Res:serde::de::DeserializeOwned,{
    let url = format!("{}getAll", define_path(entity_type));
    let response = client
        .get::<Res>(url)
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}

pub async fn create_entity<Res>(client: &ApiClient, entity: &Entity) -> Result<ApiResponse<()>, String>
where
    Res: serde::de::DeserializeOwned,{
    let url = format!("{}create", define_path(entity.entity_type));
    let response =
        client
            .post::<Entity, ()>(&url, entity)
            .await
            .map_err(|e| e.to_string())?;
    Ok(response)
}

pub async fn update_entity<Res>(client: &ApiClient, entity: &Entity)
    -> Result<ApiResponse<()>, String>
where
    Res: serde::de::DeserializeOwned,{

    let url = format!("{}update", define_path(entity.entity_type));
    let response = client
        .post::<Entity, ()>(&url, entity)
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}

pub async fn delete_entity<Res>(client: &ApiClient, entity: &Entity) -> Result<ApiResponse<()>, String> {
    let url = format!("{}delete/{}", define_path(entity.entity_type), entity.id);
    let response = client
        .delete(url)
        .await
        .map_err(|e| e.to_string())?;
    Ok(response)
}


