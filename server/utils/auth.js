const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    signToken: function({username, email, _id}) {
        const payload = { username, email, _id };

        return jwt.sign({data: payload}, secret, {expiresIn: expiration});
    },
    authMiddleware: function( {req}) {
        //allows token to be sent via req.body, req.query or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        //separate Beaarer from "<token_value>"
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim()
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }

        try {
            //decode and attach user data to request object
            const {data} = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch(e) {
            console.log('Invalid token', e);
        }

        //return updated reqquest object
        return req;
    }
};
