#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, String,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Intent {
    pub creator: Address,
    pub description: String,
    pub deadline: u64,
    pub stake_amount: i128,
    pub resolved: bool,
    pub completed: bool,
    pub total_yes_stakes: i128,
    pub total_no_stakes: i128,
}

#[contract]
pub struct IntentChain;

#[contractimpl]
impl IntentChain {
    pub fn init(env: Env, token_address: Address) {
        env.storage().instance().set(&symbol_short!("TOKEN"), &token_address);
        env.storage().instance().set(&symbol_short!("COUNT"), &0u64);
    }

    pub fn publish_intent(
        env: Env,
        creator: Address,
        description: String,
        deadline: u64,
        stake_amount: i128,
    ) -> u64 {
        creator.require_auth();
        
        let token_addr: Address = env.storage().instance().get(&symbol_short!("TOKEN")).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        
        token_client.transfer(&creator, &env.current_contract_address(), &stake_amount);

        let mut count: u64 = env.storage().instance().get(&symbol_short!("COUNT")).unwrap_or(0);
        count += 1;

        let intent = Intent {
            creator,
            description,
            deadline,
            stake_amount,
            resolved: false,
            completed: false,
            total_yes_stakes: 0,
            total_no_stakes: 0,
        };

        env.storage().persistent().set(&count, &intent);
        env.storage().instance().set(&symbol_short!("COUNT"), &count);

        count
    }

    pub fn stake(
        env: Env,
        voter: Address,
        intent_id: u64,
        support_yes: bool,
        amount: i128,
    ) {
        voter.require_auth();
        let mut intent: Intent = env.storage().persistent().get(&intent_id).expect("Intent not found");
        
        assert!(!intent.resolved, "Intent is already resolved");
        
        let token_addr: Address = env.storage().instance().get(&symbol_short!("TOKEN")).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        
        token_client.transfer(&voter, &env.current_contract_address(), &amount);

        if support_yes {
            intent.total_yes_stakes += amount;
        } else {
            intent.total_no_stakes += amount;
        }

        env.storage().persistent().set(&intent_id, &intent);
    }
}
