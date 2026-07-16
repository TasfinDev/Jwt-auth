   import userModel from "../models/user.model.js";
   import crypto from "crypto";
   import jwt from "jsonwebtoken";
   import config from "../config/config.js";
   import sessionModel from "../models/session.model.js";
   
export async function register(req,res){

 const {username,email,password} = req.body;

 const isAlreadyRegistered = await userModel.findOne({
      $or: [
   {username},
   {email}
]

})


if(isAlreadyRegistered){
return res.status(409).json({
  message : "username or email already exists",
})

}

const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");


const user = await userModel.create({
  username,
  email,
  password: hashedPassword
})

//creates token 
const refreshToken = jwt.sign({
    id: user._id,
},config.JWT_SECRET,
{
expiresIn: "7d"
}
)
const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
const session = await sessionModel.create({
  user: user._id,
  refreshTokenHash,
  ip: req.ip,
  userAgent: req.headers["user-agent"],
  revoked: false
})
const accessToken = jwt.sign({
    id: user._id,
    sessionId: session._id
},config.JWT_SECRET,
{
expiresIn: "1m"
})
//saves token
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure:false,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 1000  // 7days
})

return res.status(201).json({
  message: "User registered successfully",
  accessToken: accessToken
});
}
export async function getMe(req,res){
     
      const token = req.headers.authorization?.split(" ")[1];
     
      if(!token){
          return res.status(401).json({
             message: "token not found"
  })
    }  

   let decoded;
   try {
     decoded = jwt.verify(token, config.JWT_SECRET);
   } catch (err) {
     return res.status(401).json({
       message: "Invalid access token"
     });
   }

   const user = await userModel.findById(decoded.id);
    
   if (!user) {
  return res.status(404).json({ message: "User not found" });
  }
   res.status(202).json({

   message : "user fetched successfully",
   token,
   user : {
       username : user.username,
       email: user.email
  }
 

  })
      
}

export async function refreshToken(req,res){
const refreshToken = req.cookies.refreshToken;

if(!refreshToken){
  return res.status(401).json({
     message: "refresh token not found"
   })  
 
  }
 
let decoded;
try {
  decoded = jwt.verify(refreshToken, config.JWT_SECRET);
} catch (err) {
  return res.status(401).json({
    message: "Invalid refresh token"
  });
}

const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false
  });
  if(!session){
    return res.status(400).json({
      message: "Invalid refresh token"
    })
  }
const accessToken = jwt.sign({
    id: decoded.id,
},config.JWT_SECRET,
{
expiresIn: "1m"
});

const newRefreshToken = jwt.sign({
    id: decoded.id,
},config.JWT_SECRET,
{
expiresIn: "7d"
}
)
 const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
 session.refreshTokenHash = newRefreshTokenHash;
 await session.save();
res.cookie("refreshToken", newRefreshToken, {
  httpOnly: true,
  secure:false,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 1000  // 7days
})


return res.status(200).json({
   message: "Access token refreshed successfully",
   accessToken
})


}

export async function logout(req,res) {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken){
    return res.status(400).json({
      message: "refresh token not found"
    })
  }
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
 
  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false
  });
  if(!session){
    return res.status(400).json({
      message: "Invalid refresh token"
    })
  }
  session.revoked = true;
  await session.save();
  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "log out successfully"
  })
}
export async function logoutall(req,res){
 const refreshToken = req.cookies.refreshToken;
  if(!refreshToken){
  return res.status(401).json({
     message: "refresh token not found"
   })  
 
  }
  let decoded;
 try {
   decoded = jwt.verify(refreshToken, config.JWT_SECRET);
 } catch (err) {
   return res.status(401).json({
     message: "Invalid refresh token"
   });
 }
  await sessionModel.updateMany({
    user: decoded.id,
    revoked:false
  },{
    revoked: true
  });
  res.clearCookie("refreshToken");
  return res.status(200).json({
    message: "log out successfully"
  })
}

export async function login(req,res) {
  const {email, password} =req.body;
const user =  await userModel.findOne({email})

 if (!user){
  return res.status(401).json({
    message:"invalid email or password"
  })

 }
 const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  
 const isValidPassword = hashedPassword === user.password;
 if(!isValidPassword){
  return res.status(401).json({
    message:"invald email or password"
  })
 }
 const refreshToken = jwt.sign({
    id: user._id,
},config.JWT_SECRET,
{
expiresIn: "7d"
}
)
const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
const session = await sessionModel.create({
  user: user._id,
  refreshTokenHash,
  ip: req.ip,
  userAgent: req.headers["user-agent"],
  revoked:false
})
const accessToken = jwt.sign({
    id: user._id,
    sessionId: session._id
},config.JWT_SECRET,
{
expiresIn: "15m"
})
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure:false,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 1000  // 7days
})

return res.status(201).json({
  message: "User logged in successfully",
  accessToken: accessToken,
  user: {
    username : user.username,
    email: user.email
  }
});
}