import { pool } from '@common/database/db';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './favorites.interface';
import { PostResponse, PostResponseList } from '@/post/dto/post-response.dto';

export const createFavorite = async (favoriteData: CreateFavoriteDto): Promise<Favorite> => {
    const { post } = favoriteData;
    const { rows } = await pool.query(
        'INSERT INTO favorites (external_id, user_id, title, body) VALUES ($1, $2, $3, $4) RETURNING *',
        [post.id, post.userId, post.title, post.body]
    );

    return rows[0];
}

export const findFavoritesByExternalIds = async (externalIds: number[]): Promise<Favorite[]> => {
    if (externalIds.length === 0) {
        return [];
    }
    const { rows } = await pool.query(
        'SELECT * FROM favorites WHERE external_id = ANY($1::int[])',
        [externalIds]
    );
    return rows;
}

export const deleteFavorite = async (externalId: number): Promise<void> => {
    await pool.query('DELETE FROM favorites WHERE external_id = $1', [externalId]);
}

export const listFavorites = async (page: number, limit: number): Promise<PostResponseList> => {
    const offset = (page - 1) * limit;

    const favoritesQuery = pool.query<Favorite>(
        'SELECT * FROM favorites ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
    );

    const countQuery = pool.query<{ count: string }>(
        'SELECT COUNT(*) FROM favorites'
    );

    const [favoritesResult, countResult] = await Promise.all([favoritesQuery, countQuery]);

    const favorites = favoritesResult.rows;
    const totalFavorites = parseInt(countResult.rows[0].count, 10);

    const favoritePosts: PostResponse[] = favorites.map(fav => ({
        id: fav.external_id,
        userId: fav.user_id,
        title: fav.title,
        body: fav.body,
        isFavorite: true
    }));

    return {
        posts: favoritePosts,
        metadata: {
            totalPosts: totalFavorites,
            postsPerPage: limit,
            currentPage: page,
            totalPages: Math.ceil(totalFavorites / limit),
            postsOnCurrentPage: favoritePosts.length,
        }
    };
}
