import { User } from '@prisma/client';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { postService } from '../services';


const createPost = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { title, content, featured_image, categoryId,  } = req.body;
  const post = await postService.createPost(title, content, featured_image, categoryId, user.id); 
  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy']);
  const result = await postService.queryPosts(options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const user = req.user as User;
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.userId !== user.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized');
  }
  res.send(post);
});

const updatePost = catchAsync(async (req, res) => {
  const user = req.user as User;
  const post = await postService.updatePostById(req.params.postId, req.body);

  if (post?.userId !== user.id || user.role !== 'ADMIN') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized');
  }
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
};
