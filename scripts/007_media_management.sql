-- Media asset management functions

-- Function to create media asset record
CREATE OR REPLACE FUNCTION create_media_asset(
    asset_path text,
    asset_kind text,
    page_uuid uuid DEFAULT NULL,
    widget_instance_uuid uuid DEFAULT NULL,
    asset_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
    asset_id uuid;
BEGIN
    -- Validate kind
    IF asset_kind NOT IN ('image', 'video') THEN
        RAISE EXCEPTION 'Invalid asset kind: %. Must be image or video', asset_kind;
    END IF;
    
    -- Create media asset record
    INSERT INTO media_assets (user_id, page_id, widget_instance_id, kind, path, metadata)
    VALUES (auth.uid(), page_uuid, widget_instance_uuid, asset_kind, asset_path, asset_metadata)
    RETURNING id INTO asset_id;
    
    -- Log the activity
    INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
    VALUES (
        auth.uid(),
        'media_asset',
        asset_id,
        'created',
        jsonb_build_object(
            'path', asset_path,
            'kind', asset_kind,
            'page_id', page_uuid,
            'widget_instance_id', widget_instance_uuid
        )
    );
    
    RETURN asset_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to move asset from drafts to public on publish
CREATE OR REPLACE FUNCTION promote_draft_assets(page_uuid uuid)
RETURNS void AS $$
DECLARE
    asset_record media_assets;
    new_path text;
BEGIN
    -- Find all draft assets for this page
    FOR asset_record IN
        SELECT * FROM media_assets
        WHERE page_id = page_uuid
        AND user_id = auth.uid()
        AND path LIKE 'user/' || auth.uid()::text || '/drafts/%'
    LOOP
        -- Generate new public path
        new_path = replace(asset_record.path, '/drafts/', '/public/');
        
        -- Update the asset record
        UPDATE media_assets
        SET path = new_path,
            variants = variants || jsonb_build_object('public_path', new_path)
        WHERE id = asset_record.id;
        
        -- Log the promotion
        INSERT INTO activity_log (user_id, entity_type, entity_id, action, diff)
        VALUES (
            auth.uid(),
            'media_asset',
            asset_record.id,
            'promoted',
            jsonb_build_object(
                'old_path', asset_record.path,
                'new_path', new_path
            )
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced publish function that handles media promotion
CREATE OR REPLACE FUNCTION publish_page_with_media(page_uuid uuid)
RETURNS uuid AS $$
DECLARE
    version_id uuid;
BEGIN
    -- Promote draft assets to public
    PERFORM promote_draft_assets(page_uuid);
    
    -- Publish the page
    SELECT publish_page(page_uuid) INTO version_id;
    
    RETURN version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup orphaned media assets
CREATE OR REPLACE FUNCTION cleanup_orphaned_media()
RETURNS integer AS $$
DECLARE
    cleanup_count integer;
BEGIN
    -- Delete media assets that are not referenced by any widget instances
    -- and are older than 24 hours
    DELETE FROM media_assets
    WHERE widget_instance_id IS NULL
    AND page_id IS NULL
    AND created_at < now() - interval '24 hours';
    
    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
