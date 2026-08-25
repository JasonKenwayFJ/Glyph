use serde::{Deserialize, Serialize};
use serde::de::DeserializeOwned;
use std::time::Duration;
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ApiResponse<T> {
    pub success: bool,
    pub message: String,
    pub status: u16,
    pub data: Option<T>,
}

pub struct ApiClient {
    base_url: String,
    client: reqwest::Client,
}

impl ApiClient {
    pub fn new(base_url: &str) -> Result<ApiClient, reqwest::Error> {
        Ok(ApiClient {
            base_url: base_url.to_string(),
            client: reqwest::Client::builder()
                .timeout(Duration::from_secs(10))
                .build()?,
        })
    }

    pub async fn post<Req, Res>(
        &self,
        path: &str,
        obj: &Req,
    ) -> Result<ApiResponse<Res>, String>
    where
        Req: Serialize,
        Res: DeserializeOwned,
    {
        let url = format!("{}/{}", self.base_url, path);

        let body = serde_json::to_string(obj)
            .map_err(|err| err.to_string())?;

        let response = self.client
            .post(&url)
            .header("Content-Type", "application/json")
            .body(body)
            .send()
            .await
            .map_err(|err| err.to_string())?;

        let status = response.status();

        if !status.is_success() {
            let text = response
                .text()
                .await
                .map_err(|err| err.to_string())?;

            return Err(format!(
                "Сервер ответил ошибкой {}: {}",
                status,
                text
            ));
        }

        response
            .json::<ApiResponse<Res>>()
            .await
            .map_err(|err| err.to_string())
    }

    pub async fn get<Res>(
        &self,
        path: &str,
    ) -> Result<ApiResponse<Res>, String>
    where
        Res: DeserializeOwned,
    {
        let url = format!("{}/{}", self.base_url, path);

        let response = self.client
            .get(&url)
            .send()
            .await
            .map_err(|err| err.to_string())?;

        let status = response.status();

        if !status.is_success() {
            let text = response
                .text()
                .await
                .map_err(|err| err.to_string())?;

            return Err(format!(
                "Сервер ответил ошибкой {}: {}",
                status,
                text
            ));
        }

        response
            .json::<ApiResponse<Res>>()
            .await
            .map_err(|err| err.to_string())
    }

    pub async fn delete(
        &self,
        path: &str,
    ) -> Result<ApiResponse<()>, String> {
        let url = format!("{}/{}", self.base_url, path);

        let response = self.client
            .delete(&url)
            .send()
            .await
            .map_err(|err| err.to_string())?;

        let status = response.status();

        if !status.is_success() {
            let text = response
                .text()
                .await
                .map_err(|err| err.to_string())?;

            return Err(format!(
                "Сервер ответил ошибкой {}: {}",
                status,
                text
            ));
        }

        response
            .json::<ApiResponse<()>>()
            .await
            .map_err(|err| err.to_string())
    }

    pub fn handle_response() {}
}