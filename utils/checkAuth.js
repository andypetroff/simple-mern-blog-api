import JWT from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = JWT.verify(token, 'secret_code');
            req.userId = decoded._id;
            next();

        } catch (e) {
            return res.status(403).json({
                message: 'No access',
            });
        }
    } else {
        return res.status(403).json({
            message: 'No access',
        });
    }
};
