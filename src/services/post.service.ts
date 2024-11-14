import { Post, Role, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */
const createPost = async (
  title: string,
  content: string,
  featured_image: string,
  categoryId: number,
  userId: number,
): Promise<Post> => {
  return prisma.post.create({
    data: {
      title,
      content,
      featured_image,
      categoryId,
      userId,
    }
  });
};

/**
 * Query for posts
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPosts = async <Key extends keyof Post>(
  options: {
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'title',
    'content',
    'featured_image',
    'categoryId',
    'userId',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Post, Key>[]> => {
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const posts = await prisma.post.findMany({
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return posts as Pick<Post, Key>[];
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Post, Key> | null>}
 */
const getPostById = async <Key extends keyof Post>(
  id: number,
  keys: Key[] = [
    'id',
    'title',
    'content',
    'featured_image',
    'categoryId',
    'userId',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Post, Key> | null> => {
  return prisma.post.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Post, Key> | null>;
};

/**
 * Get post by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Post, Key> | null>}
 */

/**
 * Update post by id
 * @param {ObjectId} postId
 * @param {Object} updateBody
 * @returns {Promise<Post>}
 */
const updatePostById = async <Key extends keyof Post>(
  postId: number,
  updateBody: Prisma.PostUpdateInput,
  keys: Key[] = ['id', 'title', 'content', 'featured_image'] as Key[]
): Promise<Pick<Post, Key> | null> => {
  const post = await getPostById(postId, ['id', 'title', 'content']);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
 
  const updatedPost = await prisma.post.update({
    where: { id: post.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedPost as Pick<Post, Key> | null;
};

/**
 * Delete post by id
 * @param {ObjectId} postId
 * @returns {Promise<Post>}
 */
const deletePostById = async (postId: number): Promise<Post> => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await prisma.post.delete({ where: { id: post.id } });
  return post;
};

export default {
  createPost,
  queryPosts,
  getPostById,
  updatePostById,
  deletePostById
};
