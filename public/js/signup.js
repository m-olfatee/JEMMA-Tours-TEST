import axios from "axios"
import { showAlert } from "./alerts"

export const signup = async (name, email, password, passwordConfirm) => {
    try {
        const result = await axios({
            method: "POST",
            url: "/api/v1/users/signup",
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        })

        if (result.data.status === "success") {
            console.log(result)
            showAlert("success", "Signed up an logged in successfully!")
            window.setTimeout(() => {
                location.assign("/overview")
            }, 500)
        }
    } catch (error) {
        showAlert("error", error.response.data.message)
    }
}