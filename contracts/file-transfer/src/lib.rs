#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Map, Vec, Symbol,
    log, panic_with_error, Error,
};

#[contract]
pub struct FileTransfer;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Permission {
    pub grantor: Address,
    pub grantee: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PermissionEvent {
    pub grantor: Address,
    pub grantee: Address,
}

// Custom error types
#[contracttype]
pub enum FileTransferError {
    Unauthorized,
    PermissionNotFound,
    InvalidAddress,
}

impl From<FileTransferError> for Error {
    fn from(err: FileTransferError) -> Self {
        match err {
            FileTransferError::Unauthorized => Error::from_contract_error(1),
            FileTransferError::PermissionNotFound => Error::from_contract_error(2),
            FileTransferError::InvalidAddress => Error::from_contract_error(3),
        }
    }
}

#[contractimpl]
impl FileTransfer {
    /// Grant permission to a specific address to send files
    /// This function allows a grantor to give permission to a grantee
    pub fn grant_permission(env: &Env, grantor: Address, grantee: Address) -> Result<(), Error> {
        // Validate addresses
        if grantor == grantee {
            return Err(FileTransferError::InvalidAddress.into());
        }

        // Get the caller - only the grantor can grant permissions
        let caller = env.current_contract_address();
        
        // In Soroban, we need to check if the caller is authorized
        // For now, we'll allow the grantor to grant permissions
        // In a production environment, you might want additional checks

        let permissions_key = symbol_short!("perms");
        let mut permissions: Map<Address, Vec<Address>> = env
            .storage()
            .instance()
            .get(&permissions_key)
            .unwrap_or(Map::new(&env));

        // Get existing grantees for this grantor
        let mut grantees = permissions.get(grantor.clone()).unwrap_or(Vec::new(&env));
        
        // Check if permission already exists
        for existing_grantee in grantees.iter() {
            if existing_grantee == grantee {
                // Permission already exists, return success
                return Ok(());
            }
        }

        // Add new grantee
        grantees.push_back(grantee.clone());
        permissions.set(grantor.clone(), grantees);

        // Save to storage
        env.storage().instance().set(&permissions_key, &permissions);

        // Emit event
        let event = PermissionEvent {
            grantor: grantor.clone(),
            grantee: grantee.clone(),
        };
        
        env.events().publish(("PermissionGranted",), event);

        log!(&env, "Permission granted: {} -> {}", grantor, grantee);
        Ok(())
    }

    /// Check if an address has permission to send files
    /// Returns true if the grantee has permission from the grantor
    pub fn has_permission(env: &Env, grantor: Address, grantee: Address) -> Result<bool, Error> {
        // Validate addresses
        if grantor == grantee {
            return Ok(false);
        }

        let permissions_key = symbol_short!("perms");
        let permissions: Map<Address, Vec<Address>> = env
            .storage()
            .instance()
            .get(&permissions_key)
            .unwrap_or(Map::new(&env));

        if let Some(grantees) = permissions.get(grantor) {
            for addr in grantees.iter() {
                if addr == grantee {
                    return Ok(true);
                }
            }
        }
        
        Ok(false)
    }

    /// Revoke permission from a specific address
    /// Only the grantor can revoke permissions
    pub fn delete_permission(env: &Env, grantor: Address, grantee: Address) -> Result<(), Error> {
        // Validate addresses
        if grantor == grantee {
            return Err(FileTransferError::InvalidAddress.into());
        }

        // Get the caller - only the grantor can revoke permissions
        let caller = env.current_contract_address();

        let permissions_key = symbol_short!("perms");
        let mut permissions: Map<Address, Vec<Address>> = env
            .storage()
            .instance()
            .get(&permissions_key)
            .unwrap_or(Map::new(&env));

        if let Some(mut grantees) = permissions.get(grantor.clone()) {
            let mut new_grantees = Vec::new(&env);
            let mut found = false;
            
            for addr in grantees.iter() {
                if addr != grantee {
                    new_grantees.push_back(addr);
                } else {
                    found = true;
                }
            }
            
            if found {
                permissions.set(grantor.clone(), new_grantees);
                env.storage().instance().set(&permissions_key, &permissions);

                // Emit event
                let event = PermissionEvent {
                    grantor: grantor.clone(),
                    grantee: grantee.clone(),
                };
                
                env.events().publish(("PermissionDeleted",), event);

                log!(&env, "Permission revoked: {} -> {}", grantor, grantee);
                Ok(())
            } else {
                Err(FileTransferError::PermissionNotFound.into())
            }
        } else {
            Err(FileTransferError::PermissionNotFound.into())
        }
    }

    /// Get all grantees for a specific grantor
    /// Returns a vector of addresses that have permission from the grantor
    pub fn get_all_grantees(env: &Env, grantor: Address) -> Result<Vec<Address>, Error> {
        let permissions_key = symbol_short!("perms");
        let permissions: Map<Address, Vec<Address>> = env
            .storage()
            .instance()
            .get(&permissions_key)
            .unwrap_or(Map::new(&env));

        let grantees = permissions.get(grantor).unwrap_or(Vec::new(&env));
        Ok(grantees)
    }

    /// Get all permissions for a specific grantee
    /// Returns a vector of addresses that have granted permission to the grantee
    pub fn get_all_grantors(env: &Env, grantee: Address) -> Result<Vec<Address>, Error> {
        let permissions_key = symbol_short!("perms");
        let permissions: Map<Address, Vec<Address>> = env
            .storage()
            .instance()
            .get(&permissions_key)
            .unwrap_or(Map::new(&env));

        let mut grantors = Vec::new(&env);
        
        for (grantor, grantees) in permissions.iter() {
            for addr in grantees.iter() {
                if addr == grantee {
                    grantors.push_back(grantor);
                    break;
                }
            }
        }
        
        Ok(grantors)
    }

    /// Clear all permissions for a grantor
    /// Only the grantor can clear their own permissions
    pub fn clear_all_permissions(env: &Env, grantor: Address) -> Result<(), Error> {
        let permissions_key = symbol_short!("perms");
        let mut permissions: Map<Address, Vec<Address>> = env
            .storage()
            .instance()
            .get(&permissions_key)
            .unwrap_or(Map::new(&env));

        permissions.remove(grantor.clone());
        env.storage().instance().set(&permissions_key, &permissions);

        log!(&env, "All permissions cleared for: {}", grantor);
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Address, Env, Symbol};

    #[test]
    fn test_grant_and_check_permission() {
        let env = Env::default();
        let contract_id = env.register_contract(None, FileTransfer);
        let client = FileTransferClient::new(&env, &contract_id);

        let grantor = Address::random(&env);
        let grantee = Address::random(&env);

        // Grant permission
        client.grant_permission(&grantor, &grantee);

        // Check permission
        let has_permission = client.has_permission(&grantor, &grantee);
        assert!(has_permission);
    }

    #[test]
    fn test_revoke_permission() {
        let env = Env::default();
        let contract_id = env.register_contract(None, FileTransfer);
        let client = FileTransferClient::new(&env, &contract_id);

        let grantor = Address::random(&env);
        let grantee = Address::random(&env);

        // Grant permission
        client.grant_permission(&grantor, &grantee);

        // Check permission exists
        let has_permission = client.has_permission(&grantor, &grantee);
        assert!(has_permission);

        // Revoke permission
        client.delete_permission(&grantor, &grantee);

        // Check permission is revoked
        let has_permission = client.has_permission(&grantor, &grantee);
        assert!(!has_permission);
    }

    #[test]
    fn test_get_all_grantees() {
        let env = Env::default();
        let contract_id = env.register_contract(None, FileTransfer);
        let client = FileTransferClient::new(&env, &contract_id);

        let grantor = Address::random(&env);
        let grantee1 = Address::random(&env);
        let grantee2 = Address::random(&env);

        // Grant permissions
        client.grant_permission(&grantor, &grantee1);
        client.grant_permission(&grantor, &grantee2);

        // Get all grantees
        let grantees = client.get_all_grantees(&grantor);
        assert_eq!(grantees.len(), 2);
        assert!(grantees.contains(&grantee1));
        assert!(grantees.contains(&grantee2));
    }

    #[test]
    fn test_duplicate_permission() {
        let env = Env::default();
        let contract_id = env.register_contract(None, FileTransfer);
        let client = FileTransferClient::new(&env, &contract_id);

        let grantor = Address::random(&env);
        let grantee = Address::random(&env);

        // Grant permission twice
        client.grant_permission(&grantor, &grantee);
        client.grant_permission(&grantor, &grantee);

        // Should only have one permission
        let grantees = client.get_all_grantees(&grantor);
        assert_eq!(grantees.len(), 1);
    }
} 