import axios from "axios"
import { showAlert } from "./alerts"

export const login = async (email, password) => {
    try {
        const result = await axios({
            method: "POST",
            url: "http://127.0.0.1:3000/api/v1/users/login",
            data: {
                email,
                password
            }
        })
        if (result.data.status === "success") {
            console.log(result)
            showAlert("success", "Logged in successfully!")
            window.setTimeout(() => {
                location.assign("/overview")
            }, 1500)
        }
    } catch (error) {
        showAlert("error", error.response.data.message)
    }
}

export const logout = async () => {
    try {
        const result = await axios({
            method: "GET",
            url: "http://127.0.0.1:3000/api/v1/users/logout"
        })
        if (result.data.status === "success") location.reload(true)
    } catch (error) {
        console.log(error.response)
        showAlert("error", "Error logging out! Try again.")
    }
}