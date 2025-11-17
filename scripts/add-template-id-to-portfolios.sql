-- Add template_id column to portfolios table
ALTER TABLE portfolios
ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES portfolio_templates(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_template_id ON portfolios(template_id);

-- Add comment
COMMENT ON COLUMN portfolios.template_id IS 'Reference to the template this portfolio was created from. If set and no widget_instances exist, portfolio loads from template.';
