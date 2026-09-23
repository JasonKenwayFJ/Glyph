use serde::{Serialize};
use serde::de::DeserializeOwned;
use std::time::Duration;



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
    ) -> Result<Res, String>
    where
        Req: Serialize, Res:DeserializeOwned
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
            .json::<Res>()
            .await
            .map_err(|err| err.to_string())
    }

    pub async fn get<Res>(
        &self,
        path: String,
    ) -> Result<Res, String>
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
            .json::<Res>()
            .await
            .map_err(|err| err.to_string())
    }

    pub async fn delete(
        &self,
        path: String,
    ) -> Result<(), String> {
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

        // Тело ответа намеренно не парсим: успешное удаление обычно приходит
        // как 204 No Content или `{}`, а `json::<()>()` читает только литерал
        // `null` — то есть успех выглядел бы как ошибка.
        Ok(())
    }

    pub fn handle_response() {}
}