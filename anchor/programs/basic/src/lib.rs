use anchor_lang::prelude::*;

declare_id!("6EiSVZBpub8MDBKSPeFXWd51gWy2xxGwgULyJzwokiy8");

pub const ANCHOR_DISCRIMINATOR: usize = 8;
pub const ENTRY: &[u8] = b"ENTRY_STATE";

#[program]
pub mod basic {
    use super::*;
    pub fn createEntry(ctx:Context<CreateEvent>,title:String,content:String,timestamp:i64,image_url:String) ->Result<()> {
        *ctx.accounts.journal_account = JournalEntry {
            title:title,
            content:content,
            timestamp:timestamp,
            image_url:image_url, 
            user:ctx.accounts.signer.key()
         };
        Ok(())
    }

    pub fn edit_event(ctx:Context<EditEvent>,content:String,timestamp:i64) ->Result<()> {
        let journal_entry = &mut ctx.accounts.journal_account;
        journal_entry.content = content;
        journal_entry.timestamp=timestamp;
        Ok(())
    }

    pub fn close_event(ctx:Context<CloseEvent>)->Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateEvent<'info> {
    #[account(mut)]
    pub signer:Signer<'info>,

    #[account(
        init,
        payer=signer,
        space = ANCHOR_DISCRIMINATOR + JournalEntry::INIT_SPACE,
        seeds = [
            ENTRY,
            title.as_ref(),
            signer.key().as_ref(),
        ],
        bump
    )]
    pub journal_account:Account<'info,JournalEntry>,

    pub system_program:Program<'info,System>

}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct EditEvent<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,

    #[account(
        mut,
        seeds=[
            ENTRY,
            journal_account.title.as_ref(),
            signer.key().as_ref()
        ],
        bump
    )]
    pub journal_account:Account<'info,JournalEntry>,

    pub system_program:Program<'info,System>
}
#[derive(Accounts)]
#[instruction(title:String)]
pub struct CloseEvent<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,

    #[account(
        mut,
        close=signer,
        seeds=[
            ENTRY,
            journal_account.title.as_ref(),
            signer.key().as_ref()
        ],
        bump,
    )]
    pub journal_account:Account<'info,JournalEntry>,

    pub system_program:Program<'info,System>
}

#[account()]
#[derive(InitSpace)]
pub struct JournalEntry {
    #[max_len(32)]
    pub title: String,
    #[max_len(64)]
    pub content: String,
    pub timestamp: i64,
    #[max_len(24)]
    pub image_url: String,
    pub user:Pubkey
}