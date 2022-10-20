const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
exports.register = (req, res, next) => {
    const { name, email, password, phone } = req.body;


    User.findAll({ where: { email: email } }).then((users) => {
        const user = users[0];
        if (user)
            res.json({
                success: false,
                message: "User Already exist. Please Login",
            });
        else {
            User.create({
                name: name,
                email: email,
                password: password,
                phone: phone,

            })
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "Successfully Signed Up, Login now",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ success: false, message: "error while registering" });
                });
        }
    });

};


exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "user does not exist" });

        const passMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passMatch)
            return res
                .status(401)
                .json({ success: false, message: "Incorrect Password" });

       
                const token = jwt.sign({ id: user.id }, `${process.env.TOKEN_SECRET}`);
                return res.json({
                    token: token,
                    isPremium: user.isPremium,
                    email: user.email,
                    success: true,
                    message: "successfully logged in",
                });
    } catch (err) {
        res.json(err);
        console.log(err);
    }
};

// exports.login= (req,res,next)=>{
//     const { email, password} = req.body;
//     console.log(req.body);
//     User.findAll({where:{email}})
//     .then(user=>{
//         if(user.length > 0){
//             bcrypt.compare(password, user[0].password, function(err, response) {
//                 if (err){
//                 console.log(err)
//                 return res.json({message:"somthing went wrong with password", success:false})
//                 }
//                 if(response){
//                     console.log(response, 'is true')
//                     const jwtToken = generateToken(user[0].id)
//                     console.log(jwtToken)
//                     return res.json({token:jwtToken,message:"Signed-In Successfully", success:true})
//                 }else{
//                     return res.status(401).json({message:"something went wrong", success:false})
//                 }
//             })
//         }
//         else {
//             return res.status(404).json({success: false, message: 'passwords do not match'})
//         }
//     })
//     .catch(err=>{
//         console.log(err)
//         res.status(404).json({success: false, message: 'passwords do not match please enter write password'})
//     })
// }

// function generateToken(id){
//     return jwt.sign(id, process.env.TOKEN_SECRET)
// }