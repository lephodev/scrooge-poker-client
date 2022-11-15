
import { userInstance } from "./axios.config";

// This function is alternative of firebase.auth().onAuthStateChanged 
const getAuthUserData = async () => {
    try {
        const userData = await userInstance().get('/');
        return userData;
    } catch (error) {
        console.log(error);
        return {success: false}
    }
} 

const user = {
    getAuthUserData
}

export default user;