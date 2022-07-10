import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create the article',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get all articles',
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
            message: 'Failed to retrieve tags from recent articles',
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
                    message: 'Error in getting the article',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'No article was found'
                });
            }

            res.json(doc);
        }
        ).populate('user');
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to get the article',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postsId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postsId,
        },
        (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Unable to delete the article',
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'No article was found'
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
            message: 'Failed to delete the article',
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
            tags: req.body.tags.split(','),
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
            message: 'Failed to update the article',
        });
    }
};
