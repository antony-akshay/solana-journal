use anchor_lang::prelude::*;

pub mod errors;
pub mod constants;
pub mod states;

use crate::{constants::*,states::*,errors::*};

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

#[program]
pub mod basic {
    use super::*;

    pub const ANCHOR_DISCRIMINATOR:&usize = 8 ;

    pub fn createEntry(_ctx:Context<CreateEvent>) ->Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEvent {
    #[account(
        init,
        space = ANCHOR_DISCRIMINATOR + JournalEntry::INIT_SPACE,
        seeds = [journalState]
    )]

}

