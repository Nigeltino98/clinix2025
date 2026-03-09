// hooks/useGroupAccess.js

import { useSelector } from 'react-redux';

const useGroupAccess = (allowedGroups) => {
  const user = useSelector((state) => state.auth.user);

  // Check if the user belongs to any allowed group
  const hasAccess = user.groups.some((group) => allowedGroups.includes(group.name));

  return hasAccess;
};

export default useGroupAccess;
