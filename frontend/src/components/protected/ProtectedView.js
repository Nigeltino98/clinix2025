import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getApi } from '../../api/api'
import { authActions } from '../../store/auth'


const ProtectedView = ({ perm, children }) => {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector((state) => state.auth.loggedin)
    const user = useSelector((state) => state.auth.user)
    const token = useSelector((state) => state.auth.token).token

    useEffect(() => {
        if (isLoggedIn) {
            getApi(response => { dispatch(authActions.setUser(response.data)) }, token, "/api/me")
        }
    }, [dispatch, token])

    const allowed = user.permissions.find(item => item.code_name = perm)

    return (
        <div>
            {allowed ? <h1>yes</h1> : <h1>nope</h1>}
        </div>
    );
}

export default ProtectedView;