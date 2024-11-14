import Joi from 'joi';


const createPost = {
  body: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
    categoryId: Joi.number().integer(),
    userId: Joi.number().integer(),
    featured_image: Joi.string(),
  })
};

const getPosts = {
  query: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getPost = {
  params: Joi.object().keys({
    postId: Joi.number().integer()
  })
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.number().integer()
  }),
  body: Joi.object()
    .keys({
        title: Joi.string().required(),
        content: Joi.string().required(),
        featured_image: Joi.string(),
        categoryId: Joi.number().integer().required(),
    })
    .min(1)
};

const deletePost = {
  params: Joi.object().keys({
    postId: Joi.number().integer()
  })
};

export default {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
};
