import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(',').map(item => item.trim()),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create the post',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user', '_id, fullName').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get all posts',
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
        res.json(tags);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve tags from recent posts',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postsId = req.params.id;

        PostModel.findOneAndUpdate({
            _id: postsId,
        }, 
        {
            $inc: { viewsCount: 1 },
        },
        {
            returnDocument: 'after'
        },
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error in getting the post',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'No post was found'
                });
            }

            const { 
                _id, 
                title, 
                text,
                tags,
                imageUrl,
                viewsCount,
                createdAt,
                updatedAt,
                user: {
                  _id: user_id, 
                  fullName: userFullName, 
                },
            } = doc._doc;

            res.json({
                _id,
                title,
                text,
                tags,
                imageUrl,
                viewsCount,
                createdAt,
                updatedAt,
                user: {
                    _id: user_id, 
                    fullName: userFullName, 
                },
            });
        }
        ).populate('user');
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get the post',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postsId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postsId,
            user: {
              _id: req.userId,
            },
        },
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Unable to delete the post',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'No post was found for current user'
                });
            }

            res.json({
                success: true,
            });
        }
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to delete the post',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postsId = req.params.id;

        await PostModel.updateOne({
            _id: postsId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(',').map(item => item.trim()),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        }
        );

        res.json({
            success: true,
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update the post',
        });
    }
};
