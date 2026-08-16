/**
 * User Context
 *
 * Manages extended user profile data that is separate from raw auth state.
 * While AuthContext holds tokens and login status, UserContext holds
 * profile details (name, role, preferences, avatar, etc.) fetched
 * from the /users/me endpoint after authentication.
 *
 * This separation keeps concerns clean:
 *  - AuthContext  → who is logged in and whether they are authenticated
 *  - UserContext  → the detailed profile of the logged-in user
 */

import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null)

  // ── Placeholder actions ──────────────────────────────────────────────────
  const updateProfile = (data) => {
    // TODO: call userService.updateMe(data) then setUserProfile(response.data)
    // Example: const { data: updated } = await userService.updateMe(data)
    //          setUserProfile(updated)
    void data
  }

  const clearProfile = () => {
    setUserProfile(null)
  }

  const value = {
    userProfile,
    setUserProfile,
    updateProfile,
    clearProfile,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

/**
 * useUser — convenience hook for consuming UserContext.
 */
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a <UserProvider>')
  }
  return context
}

export default UserContext
