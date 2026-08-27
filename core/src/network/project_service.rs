use uuid::Uuid;
use crate::network::api_client::{ApiClient, ApiResponse};
use crate::Project;


pub async fn get_projects(client: &ApiClient, user_id: &Uuid) -> Result<Vec<Project>, String> {
    let response = client
        .get::<Vec<Project>>(format!("project/getAll/{}", user_id))
        .await
        .map_err(|e| e.to_string())?;
    if !response.success{
        println!("Error getting user projects from server");
        return Err(response.message)
    }

    response
        .data
        .ok_or_else(|| "Сервер не вернул список проектов".to_string())
}
pub async fn create_project(client: &ApiClient, project: &Project) 
    -> Result<ApiResponse<()>, String> {
    let response = client
        .post::<Project, ()>("project/create", project)
        .await
        .map_err(|e| e.to_string())?;
    if !response.success {
        println!("Error uploading a project");
        return Err(response.message);
    }
    println!("Uploaded project {}", project.id);
    Ok(response)
}
pub async fn delete_project(client: &ApiClient, project: &Project) -> Result<(), String> {

    let response = client
        .delete(format!("project/{}", project.id))
        .await
        .map_err(|e| e.to_string())?;
    if !response.success {
        println!("Error deleting a project");
        return Err(response.message);
    }
    println!("Deleted project {}", project.id);
    Ok(())
}