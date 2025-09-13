import { Post } from "../post.interface";

export interface PostResponse extends Post {
    isFavorite: boolean;
}

export interface PostResponseList {
    posts: PostResponse[];
    metadata: {
        totalPosts: number;
        postsOnCurrentPage: number;
        postsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}

