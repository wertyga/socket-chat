import axios from 'axios';
import setHeader from '../../server/common/setHeaders';
import jwtDecode from 'jwt-decode';

export const SILENT_AUTH = 'SILENT_AUTH';

export function authSilent(data) {
    return dispatch => {
        if(localStorage.jwtToken) setHeader(localStorage.jwtToken);
        return axios.post('/enter-client', data)
            .then(res => {
                if(res.data.token) localStorage.setItem('jwtToken', res.data.token);
                dispatch(silentAuth(res.data));
            })
            .catch(err => { throw err });
    }
};
function silentAuth(data) {
    return {
        type: SILENT_AUTH,
        client: {
            id: data.id,
            messages: data.messages || []
        }
    }
};
