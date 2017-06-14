import Client from '../models/CLient';

export default function findUsersMessages(_id) {
    Client.find({ _id })
        .then(client => {
            return client.messages
        })
};