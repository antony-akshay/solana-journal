use anchor_lang::prelude::*;

#[account(initSpace)]
pub struct JournalEntry {
    pub title: String,
    pub content: String,
    pub timestamp: i64,
    pub imageUrl : String
}