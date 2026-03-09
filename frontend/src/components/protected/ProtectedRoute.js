import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { permissionActions } from '../../store/permission'

const ProtectedRoute = ({ perm, children }) => {
    const dispatch = useDispatch()
    const all_perms = useSelector((state) => state.permission.allPermissions)
    const user = useSelector((state) => state.auth.user)
    let allowed = false
    if (user !== undefined && user !== null) {
        if (user.is_superuser) {
            allowed = true
        } else if (all_perms.length === 0) {
            allowed = false
        } else {
            const perm_item = all_perms.find(item => item.codename === perm)
            if (perm_item === undefined || perm_item === null) {
                allowed = false
            } else {
                allowed = true
            }
        }
    }
    useEffect(() => {
        if (user !== undefined && user !== null) {
            const user_permissions = user.user_permissions //  user specified permissions
            const group_permissions = []
            const individual_group_perms = user.groups.map(group => group.permissions) // group permissions
            individual_group_perms.map(item => group_permissions.push(...item))
            const all_perms = [...group_permissions, ...user_permissions]
            dispatch(permissionActions.setAllPermissions(all_perms))
        }
    }, [dispatch, user])
    return (
        <span>
            {allowed && children}
        </span>
    );
}

export default ProtectedRoute;