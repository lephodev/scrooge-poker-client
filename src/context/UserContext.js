import { createContext } from 'react'

const UserContext = createContext({
  userInAnyGame: {},
  setUserInAnyGame: () => {},
  user:{},
  setUser:()=>{}
})

export default UserContext