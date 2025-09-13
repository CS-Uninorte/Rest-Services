import { axiosInstance } from "@common/axios/instance";
import { Post } from "./post.interface";
import { PostResponse, PostResponseList } from "./dto/post-response.dto";
import { findFavoritesByExternalIds } from "@/favorites/favorites.service";

export const listPosts = async (
  page: number,
  limit: number,
): Promise<PostResponseList> => {
  const response = await axiosInstance.get<Post[]>("/posts", {
    params: {
      _page: page,
      _limit: limit,
    },
  });

  const postsFromApi = response.data;
  const totalPosts = Number(response.headers["x-total-count"]);

  const postIds = postsFromApi.map((p) => p.id);
  const favoritePosts = await findFavoritesByExternalIds(postIds);
  const favoritePostIds = new Set(favoritePosts.map((f) => f.external_id));

  const posts: PostResponse[] = postsFromApi.map((post) => ({
    ...post,
    isFavorite: favoritePostIds.has(post.id),
  }));

  return {
    posts,
    metadata: {
      totalPosts,
      postsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      postsOnCurrentPage: posts.length,
    },
  };
};

export const getPost = async (id: number): Promise<PostResponse> => {
  const { data } = await axiosInstance.get<Post>(`/posts/${id}`);
  const favoritePosts = await findFavoritesByExternalIds([id]);

  return {
    ...data,
    isFavorite: favoritePosts.length > 0,
  };
};