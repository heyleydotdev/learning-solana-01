use anchor_lang::prelude::*;

declare_id!("9j59z5JAvp6XDvY7XhRJC9oPKg4WmEDWZa3bj4H4RdHq");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
