module Marketplace {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use MyToken;

    /// Marketplace data structure
    struct Marketplace has key {
        listings: vector<Listing>,
        listing_events: event::EventHandle<ListingEvent>,
        purchase_events: event::EventHandle<PurchaseEvent>,
        fee_percentage: u64
    }

    /// Listing structure
    struct Listing has store, drop {
        id: u64,
        seller: address,
        token_amount: u64,
        price: u64,
        active: bool
    }

    /// Event emitted when a new listing is created
    struct ListingEvent has drop, store {
        listing_id: u64,
        seller: address,
        token_amount: u64,
        price: u64,
        timestamp: u64
    }

    /// Event emitted when a purchase is made
    struct PurchaseEvent has drop, store {
        listing_id: u64,
        buyer: address,
        seller: address,
        token_amount: u64,
        price: u64,
        timestamp: u64
    }

    const ENO_MARKETPLACE: u64 = 0;
    const INVALID_PRICE: u64 = 1;
    const LISTING_NOT_FOUND: u64 = 2;
    const LISTING_NOT_ACTIVE: u64 = 3;
    const INSUFFICIENT_FUNDS: u64 = 4;
    const UNAUTHORIZED: u64 = 5;

    public fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<Marketplace>(addr), ENO_MARKETPLACE);

        move_to(account, Marketplace {
            listings: vector::empty(),
            listing_events: account::new_event_handle<ListingEvent>(account),
            purchase_events: account::new_event_handle<PurchaseEvent>(account),
            fee_percentage: 250  // 2.5% fee
        });
    }

    public fun create_listing(
        account: &signer,
        token_amount: u64,
        price: u64
    ) acquires Marketplace {
        let addr = signer::address_of(account);
        assert!(price > 0, INVALID_PRICE);
        assert!(MyToken::balance_of(addr) >= token_amount, INSUFFICIENT_FUNDS);

        let marketplace = borrow_global_mut<Marketplace>(@marketplace);
        let listing_id = vector::length(&marketplace.listings);

        let listing = Listing {
            id: listing_id,
            seller: addr,
            token_amount,
            price,
            active: true
        };

        vector::push_back(&mut marketplace.listings, listing);

        // Emit listing event
        event::emit_event(&mut marketplace.listing_events, ListingEvent {
            listing_id,
            seller: addr,
            token_amount,
            price,
            timestamp: timestamp::now_microseconds()
        });
    }

    public fun purchase_listing(
        buyer: &signer,
        listing_id: u64
    ) acquires Marketplace {
        let buyer_addr = signer::address_of(buyer);
        let marketplace = borrow_global_mut<Marketplace>(@marketplace);
        
        assert!(listing_id < vector::length(&marketplace.listings), LISTING_NOT_FOUND);
        let listing = vector::borrow_mut(&mut marketplace.listings, listing_id);
        assert!(listing.active, LISTING_NOT_ACTIVE);

        // Calculate fees
        let fee_amount = (listing.price * marketplace.fee_percentage) / 10000;
        let seller_amount = listing.price - fee_amount;

        // Transfer APT from buyer to seller and marketplace
        let payment = coin::withdraw<AptosCoin>(buyer, listing.price);
        let fee = coin::extract(&mut payment, fee_amount);
        coin::deposit(@marketplace, fee);
        coin::deposit(listing.seller, payment);

        // Transfer tokens from seller to buyer
        MyToken::transfer(listing.seller, buyer_addr, listing.token_amount);

        // Update listing status
        listing.active = false;

        // Emit purchase event
        event::emit_event(&mut marketplace.purchase_events, PurchaseEvent {
            listing_id,
            buyer: buyer_addr,
            seller: listing.seller,
            token_amount: listing.token_amount,
            price: listing.price,
            timestamp: timestamp::now_microseconds()
        });
    }

    public fun cancel_listing(
        account: &signer,
        listing_id: u64
    ) acquires Marketplace {
        let addr = signer::address_of(account);
        let marketplace = borrow_global_mut<Marketplace>(@marketplace);
        
        assert!(listing_id < vector::length(&marketplace.listings), LISTING_NOT_FOUND);
        let listing = vector::borrow_mut(&mut marketplace.listings, listing_id);
        assert!(listing.active, LISTING_NOT_ACTIVE);
        assert!(listing.seller == addr, UNAUTHORIZED);

        listing.active = false;
    }

    public fun get_listing(listing_id: u64): Listing acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(@marketplace);
        assert!(listing_id < vector::length(&marketplace.listings), LISTING_NOT_FOUND);
        *vector::borrow(&marketplace.listings, listing_id)
    }
}