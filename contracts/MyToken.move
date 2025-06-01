module MyToken {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    /// Custom token struct
    struct MyToken has key {
        mint_events: event::EventHandle<MintEvent>,
        burn_events: event::EventHandle<BurnEvent>,
        transfer_events: event::EventHandle<TransferEvent>
    }

    /// Token storage for each account
    struct TokenStore has key {
        balance: u64
    }

    /// Event emitted when tokens are minted
    struct MintEvent has drop, store {
        amount: u64,
        recipient: address,
        timestamp: u64
    }

    /// Event emitted when tokens are burned
    struct BurnEvent has drop, store {
        amount: u64,
        burner: address,
        timestamp: u64
    }

    /// Event emitted when tokens are transferred
    struct TransferEvent has drop, store {
        amount: u64,
        from: address,
        to: address,
        timestamp: u64
    }

    const ENO_TOKEN: u64 = 0;
    const INSUFFICIENT_BALANCE: u64 = 1;
    const NOT_TOKEN_OWNER: u64 = 2;

    public fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<MyToken>(addr), ENO_TOKEN);

        move_to(account, MyToken {
            mint_events: account::new_event_handle<MintEvent>(account),
            burn_events: account::new_event_handle<BurnEvent>(account),
            transfer_events: account::new_event_handle<TransferEvent>(account)
        });

        move_to(account, TokenStore { balance: 0 });
    }

    public fun mint(account: &signer, amount: u64) acquires MyToken, TokenStore {
        let addr = signer::address_of(account);
        assert!(exists<MyToken>(addr), ENO_TOKEN);

        let token_store = borrow_global_mut<TokenStore>(addr);
        token_store.balance = token_store.balance + amount;

        // Emit mint event
        let token = borrow_global_mut<MyToken>(addr);
        event::emit_event(&mut token.mint_events, MintEvent {
            amount,
            recipient: addr,
            timestamp: timestamp::now_microseconds()
        });
    }

    public fun burn(account: &signer, amount: u64) acquires MyToken, TokenStore {
        let addr = signer::address_of(account);
        assert!(exists<MyToken>(addr), ENO_TOKEN);

        let token_store = borrow_global_mut<TokenStore>(addr);
        assert!(token_store.balance >= amount, INSUFFICIENT_BALANCE);
        token_store.balance = token_store.balance - amount;

        // Emit burn event
        let token = borrow_global_mut<MyToken>(addr);
        event::emit_event(&mut token.burn_events, BurnEvent {
            amount,
            burner: addr,
            timestamp: timestamp::now_microseconds()
        });
    }

    public fun transfer(from: &signer, to: address, amount: u64) acquires MyToken, TokenStore {
        let from_addr = signer::address_of(from);
        assert!(exists<TokenStore>(from_addr), ENO_TOKEN);
        assert!(exists<TokenStore>(to), ENO_TOKEN);

        let from_store = borrow_global_mut<TokenStore>(from_addr);
        assert!(from_store.balance >= amount, INSUFFICIENT_BALANCE);
        from_store.balance = from_store.balance - amount;

        let to_store = borrow_global_mut<TokenStore>(to);
        to_store.balance = to_store.balance + amount;

        // Emit transfer event
        let token = borrow_global_mut<MyToken>(from_addr);
        event::emit_event(&mut token.transfer_events, TransferEvent {
            amount,
            from: from_addr,
            to,
            timestamp: timestamp::now_microseconds()
        });
    }

    public fun balance_of(addr: address): u64 acquires TokenStore {
        assert!(exists<TokenStore>(addr), ENO_TOKEN);
        borrow_global<TokenStore>(addr).balance
    }
}