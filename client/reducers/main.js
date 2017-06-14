import { SILENT_AUTH } from '../actions/actions';

export default function main(state = [], action = {}) {
    switch(action.type) {

        case SILENT_AUTH:
            return {
                id: action.client.id,
                messages: action.client.messages
            };

        default:
            return state;
    };
};