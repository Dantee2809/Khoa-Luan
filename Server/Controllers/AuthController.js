import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    const { username, password, firstname, lastname ,email } = req.body;

    try {
        // Kiểm tra xem username có tồn tại trong database không
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username đã tồn tại" });
        }
        if(password.langth <= 5) {
            return res
            .status(400).json({ message: "Mật khẩu nên dài hơn 5 kí tự " });
        }
        // Nếu không trùng, tiếp tục hash mật khẩu và lưu người dùng
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
            username,
            password: hashedPassword,
            email,
            firstname,
            lastname
            
        });

        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const loginUser = async (req , res) => {
    try {
        const {username , password} = req.body;

        const existUser = await UserModel.findOne({username})
        if(!existUser){
            return res.status(400).json({message:"User not found"})
        }
        await bcrypt.compare(password, existUser.password, (err, data) => {
            if(data) {
                const authClaims = [
                    {name: existUser.username},
                    {role: existUser.role}
                ];
                const token = jwt.sign({authClaims},"lostnfound",{expiresIn:"30d"});
                res.status(200).json({message: "Log success", id: existUser._id, role: existUser.role, token:token});

            }
            else {
                res.status(400).json("Wrong / User does not exist")
            }
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const logoutUser = async (req, res) => {
    try {
        // Không cần xử lý gì nhiều vì token nằm phía client
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



