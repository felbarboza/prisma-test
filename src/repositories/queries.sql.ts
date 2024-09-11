export const insertBlogQuery = `
    INSERT INTO blogs (name, slug)
    VALUES ($1, $2)
    RETURNING *;
`;

export const insertPostQuery = `
    INSERT INTO posts (title, content, blog_id)
    VALUES ($1, $2, $3)
    RETURNING *;
`;

export const findBlogBySlugQuery = `
    SELECT 
        b.id AS blog_id,
        b.name AS blog_name,
        b.slug AS blog_slug
    FROM blogs b WHERE slug = $1;
`;

export const findBlogByIdQuery = `
    SELECT 
        b.id AS blog_id,
        b.name AS blog_name,
        b.slug AS blog_slug 
    FROM blogs b WHERE id = $1;
`;

export const findBlogWithPostsById = `
    WITH updated_posts AS (
        UPDATE posts
        SET view_count = view_count + 1
        WHERE blog_id = $1
        RETURNING *
    )
    SELECT 
        b.id AS blog_id,
        b.name AS blog_name,
        b.slug AS blog_slug,
        b.created_at AS blog_created_at,
        p.id AS post_id,
        p.title AS post_title,
        p.content AS post_content,
        p.view_count AS post_view_count,
        p.created_at AS post_created_at
    FROM blogs b
    LEFT JOIN posts p ON b.id = p.blog_id
    WHERE b.id = $1;
`;

export const findBlogWithPostsBySlug = `
     WITH updated_posts AS (
            UPDATE posts
            SET view_count = view_count + 1
            WHERE blog_id = (
                SELECT id FROM blogs WHERE slug = $1
            )
            RETURNING *
        )
    SELECT 
        b.id AS blog_id,
        b.name AS blog_name,
        b.slug AS blog_slug,
        b.created_at AS blog_created_at,
        p.id AS post_id,
        p.title AS post_title,
        p.content AS post_content,
        p.view_count AS post_view_count,
        p.created_at AS post_created_at
    FROM blogs b
    LEFT JOIN posts p ON b.id = p.blog_id
    WHERE b.slug = $1;
`;
