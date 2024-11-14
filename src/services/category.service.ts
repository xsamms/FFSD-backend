import { Category, Role, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (
  category_name: string,
): Promise<Category> => {

  return prisma.category.create({
    data: {
      category_name,
    }
  });
};

/**
 * Query for categorys
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async <Key extends keyof Category>(
  options: {
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'category_name',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Category, Key>[]> => {
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const categorys = await prisma.category.findMany({
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return categorys as Pick<Category, Key>[];
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Category, Key> | null>}
 */
const getCategoryById = async <Key extends keyof Category>(
  id: number,
  keys: Key[] = [
    'id',
    'category_name',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<Category, Key> | null> => {
  return prisma.category.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<Category, Key> | null>;
};

/**
 * Get category by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Category, Key> | null>}
 */

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async <Key extends keyof Category>(
  categoryId: number,
  updateBody: Prisma.CategoryUpdateInput,
  keys: Key[] = ['id', 'category_name'] as Key[]
): Promise<Pick<Category, Key> | null> => {
  const category = await getCategoryById(categoryId, ['id', 'category_name']);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
 
  const updatedCategory = await prisma.category.update({
    where: { id: category.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedCategory as Pick<Category, Key> | null;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId: number): Promise<Category> => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await prisma.category.delete({ where: { id: category.id } });
  return category;
};

export default {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};
