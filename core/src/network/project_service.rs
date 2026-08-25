use crate::network::api_client::{ApiClient, ApiResponse};
use crate::Project;

pub async fn create_project(
    client: &ApiClient,
    project: &Project,
) -> Result<ApiResponse<Project>, String> {
    client
        .post::<Project, Project>("project/create", project)
        .await
}
