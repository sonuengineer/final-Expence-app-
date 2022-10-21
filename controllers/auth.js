const User = require("../model/user");
const bcrypt = require("bcrypt");
exports.register = (req, res, next) => {
    const { name, email, password, phone } = req.body;



    bcrypt.hash(password, 10, (err, hash) => {
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
                    password: hash,
                    //password: password,
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

    });
    

};


exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "user does not exist" });

        //var a = user.password
        //var b = req.body.password
      
        //const passMatch=(a==b)?true:false
        const passMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passMatch)
            return res
                .status(401)
                .json({ success: false, message: "Incorrect Password" });


       
        return res.json({
           
            email: user.email,
            success: true,
            message: "successfully logged in",
        });
    } catch (err) {
        res.json(err);
        console.log(err);
    }
};



