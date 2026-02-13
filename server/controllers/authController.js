const { use } = require("react");
const generateToken = require("../utils/generateToken");



exports.register = async(req,res,next) => {
    try {
        const {name,email,password} = req.body;

        const userExists = await Users.findOne({email});

        if(userExists) {
            return res.status(400).json({
                success : false,
                message : "user already exists with this email "
            })
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id)
        res.status(201).json({
            success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
        });

    }catch (error){
        next(error);
    }
};


expports.login = async (req,res,next) => {
    try{

        const {email , password} = req.body;

        if(!email || ! password){
            return res.status(400).json({
                success : false,
                message : "please provide email and password"
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }


     if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    } 
    catch(error) {
        next(error);
    }
};