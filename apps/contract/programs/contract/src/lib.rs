use anchor_lang::prelude::*;

declare_id!("9j59z5JAvp6XDvY7XhRJC9oPKg4WmEDWZa3bj4H4RdHq");

#[program]
pub mod contract {
    use super::*;

    pub fn create_todo(ctx: Context<CreateToDoEntry>, id: Pubkey, content: String) -> Result<()> {
        let entry = &mut ctx.accounts.todo_entry;

        entry.id = id;
        entry.user = *ctx.accounts.user.key;
        entry.content = content;
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct CreateToDoEntry<'info> {
    #[account(
        init,
        seeds = [b"todo_seeds", id.key().as_ref(), user.key().as_ref()],
        bump,
        payer = user,
        space = DISCRIMINATOR + ToDoState::INIT_SPACE,
    )]
    pub todo_entry: Account<'info, ToDoState>,
    
    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct ToDoState {
    pub id: Pubkey,
    pub user: Pubkey,
    #[max_len(20)]
    pub content: String
}

const DISCRIMINATOR: usize = 8;