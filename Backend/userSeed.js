
import connectToDatabase from "./db/db.js";
import User from "./models/User.js"
import bcrypt from "bcrypt"

const userRegister = async () => {
    await connectToDatabase();
    try {
        const hashPassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            name: "admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        })
        await newUser.save()  
    } catch(error) {
        console.log(error)
    }
}

userRegister();