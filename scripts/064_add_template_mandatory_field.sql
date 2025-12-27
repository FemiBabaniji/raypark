-- Add mandatory template functionality to portfolio_templates
-- This allows admins to designate a required template for their community

-- Add is_mandatory column
ALTER TABLE portfolio_templates 
ADD COLUMN IF NOT EXISTS is_mandatory boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN portfolio_templates.is_mandatory IS 
'If true, users in this community must use this template when creating portfolios. Only one mandatory template allowed per community.';

-- Create unique partial index to ensure only one mandatory template per community
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_mandatory_template_per_community 
ON portfolio_templates (community_id) 
WHERE is_mandatory = true AND is_active = true;

-- Add comment on the index
COMMENT ON INDEX idx_one_mandatory_template_per_community IS 
'Ensures each community can only have one active mandatory template';

-- Create function to validate mandatory template creation
CREATE OR REPLACE FUNCTION validate_mandatory_template()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a template as mandatory, unset any other mandatory templates in the same community
  IF NEW.is_mandatory = true AND NEW.is_active = true THEN
    UPDATE portfolio_templates
    SET is_mandatory = false
    WHERE community_id = NEW.community_id
      AND id != NEW.id
      AND is_mandatory = true;
      
    -- Log the change
    RAISE NOTICE 'Set template % as mandatory for community %. Other mandatory templates have been unmarked.', NEW.id, NEW.community_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce mandatory template validation
DROP TRIGGER IF EXISTS trigger_validate_mandatory_template ON portfolio_templates;
CREATE TRIGGER trigger_validate_mandatory_template
  BEFORE INSERT OR UPDATE ON portfolio_templates
  FOR EACH ROW
  EXECUTE FUNCTION validate_mandatory_template();

-- Add helpful view for admins to see template usage
CREATE OR REPLACE VIEW community_template_summary AS
SELECT 
  pt.community_id,
  c.name as community_name,
  pt.id as template_id,
  pt.name as template_name,
  pt.is_mandatory,
  pt.is_active,
  COUNT(DISTINCT p.id) as portfolio_count,
  pt.created_at
FROM portfolio_templates pt
LEFT JOIN communities c ON c.id = pt.community_id
LEFT JOIN portfolios p ON p.template_id = pt.id
WHERE pt.community_id IS NOT NULL
GROUP BY pt.id, pt.community_id, c.name, pt.name, pt.is_mandatory, pt.is_active, pt.created_at
ORDER BY pt.community_id, pt.is_mandatory DESC, pt.created_at DESC;

COMMENT ON VIEW community_template_summary IS 
'Shows template usage statistics per community for admin dashboard';
