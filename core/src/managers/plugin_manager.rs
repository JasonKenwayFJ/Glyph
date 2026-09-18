use crate::entities::plugin::Plugin;
use std::sync::Mutex;
use uuid::Uuid;

pub struct PluginManager{
    plugins: Mutex<Option<Vec<Plugin>>>,
    active_plugins: Mutex<Option<Vec<Plugin>>>,
}

impl PluginManager {
    pub fn new() -> PluginManager{
        PluginManager{
            plugins: Mutex::new(None),
            active_plugins: Mutex::new(None),
        }
    }


    pub fn get_all_plugins(&self) -> Option<Vec<Plugin>>{
         self.plugins.lock().unwrap().clone()
    }
    pub fn get_active_plugins(&self) -> Option<Vec<Plugin>>{
        self.active_plugins.lock().unwrap().clone()
    }
    pub fn activate_plugin(&self, plugin_id: Uuid) -> Result<(), String> {
        let plugin = {
            let mut guard = self.plugins.lock().unwrap();

            let plugins = guard
                .as_mut()
                .ok_or("Plugins haven't been loaded".to_string())?;

            let plugin = plugins
                .iter_mut()
                .find(|plugin| plugin.id == plugin_id)
                .ok_or("Plugin not found".to_string())?;

            plugin.enabled = true;

            plugin.clone()
        };

        let mut guard = self.active_plugins.lock().unwrap();

        let active_plugins = guard
            .as_mut()
            .ok_or("Plugins haven't been loaded".to_string())?;

        active_plugins.push(plugin);

        Ok(())
    }
    pub fn deactivate_plugin(&self, plugin_id: Uuid) -> Result<(), String> {

        {
            let mut guard = self.plugins.lock().unwrap();

            let plugins = guard
                .as_mut()
                .ok_or("Plugins haven't been loaded".to_string())?;

            let plugin = plugins
                .iter_mut()
                .find(|plugin| plugin.id == plugin_id)
                .ok_or("Plugin not found".to_string())?;

            plugin.enabled = false;
        }

        {
            let mut guard = self.active_plugins.lock().unwrap();

            let plugins = guard
                .as_mut()
                .ok_or("Plugins haven't been loaded".to_string())?;

            let exists = plugins.iter().any(|plugin| plugin.id == plugin_id);

            if !exists {
                return Err("Plugin is not active".to_string());
            }

            plugins.retain(|plugin| plugin.id != plugin_id);
        }

        Ok(())
    }

    pub fn add_plugin(&self, plugin: Plugin) -> Result<(), String> {
        let mut guard = self.plugins.lock().unwrap();
        let plugins = guard.as_mut().ok_or("Could not open the plugin list".to_string())?;
        plugins.push(plugin.clone());
        Ok(())
    }
    
    pub fn delete_plugin(&self, plugin_id: Uuid) -> Result<(), String> {
        {
            let mut guard = self.plugins.lock().unwrap();
            let plugins = guard
                .as_mut()
                .ok_or("Plugins haven't been loaded".to_string())?.retain(|p| p.id == plugin_id);
            
        }

        {
            let mut guard = self.active_plugins.lock().unwrap();
            let plugins = guard
                .as_mut()
                .ok_or("Plugins haven't been loaded".to_string())?.retain(|p| p.id == plugin_id);
        }

        Ok(())
    }
}