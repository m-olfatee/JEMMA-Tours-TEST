import axios from "axios"
import { showAlert } from "./alerts"

export const login = async (email, password) => {
    try {
        const result = await axios({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email,
                password
            }
        })
        if (result.data.status === "success") {
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
            url: "/api/v1/users/logout"
        })
        if (result.data.status === "success") {
            window.setTimeout(() => {
                location.assign("/")
            }, 100)
        }
    } catch (error) {
        console.log(error.response)
        showAlert("error", "Error logging out! Try again.")
    }
}