import jwt from 'jsonwebtoken';
import setHeader from '../common/setHeaders';
import { passwordJwt } from '../index';

export default (req, res, next) => {
    let header = req.headers['authorization'];
    let token;

    if(header) {
        token = header.split(' ')[1];
        jwt.verify(token, passwordJwt, (err, decode) => {
            if (err) {
                res.status(401).json({error: 'Wrong verifying token'})
            } else {
                req.body.id = decode.id;
                next();
            }
        });
    } else {
        next();
    };

};