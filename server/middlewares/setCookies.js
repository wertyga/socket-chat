import Client from '../models/CLient';
import Message from '../models/Message';

import jwt from 'jsonwebtoken';
import { passwordJwt } from '../index';
import cookies from 'cookie_js';

export default async function setCookies (req, res, next) {
    //let token = cookies.get('token');
    if(!token) {
        let client = await new Client().save();
        await new Message({user: client._id}).save();
        let token = await jwt.sign({
            id: client._id
        }, passwordJwt);
        //cookies.set('token', token);
        console.log(cookies.all())
        //next();
    } else {
        //next();
    };
};