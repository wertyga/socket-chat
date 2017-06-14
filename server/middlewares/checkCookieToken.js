import jwt from 'jsonwebtoken';
import { passwordJwt } from '../index';
import cookies from 'cookie_js';

export default (req, res, next) => {
    //let token = cookies.get('token');

    if(false) {
        jwt.verify(token, passwordJwt, (err, decode) => {
            if (err) {
                res.status(401).json({errors: 'Wrong verifying token'})
            } else {
                next();
            }
        });
    } else {
        next();
    };

};