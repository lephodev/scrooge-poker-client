import { createContext } from 'react'

const UserContext = createContext({
  userInAnyGame: {},
  setUserInAnyGame: () => {},
})

export default UserContext