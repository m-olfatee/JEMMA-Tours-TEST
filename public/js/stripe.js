import axios from "axios"
import { showAlert } from "./alerts"
const stripe = Stripe("pk_test_51KVUakFjeISbRNbnPk20LZMloz7WCqAlTNXR1TssZtvXHM7kOztxuQGk2Iytc7KxSUkshCl3xW2nl24nvK0yKG8b00n6ThkOF0")

export const bookTour = async (tourId) => {
    try {
        // 1) Get the checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`)
        // console.log(session)
        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (error) {
        console.log(error)
        showAlert("error", error)
    }

}