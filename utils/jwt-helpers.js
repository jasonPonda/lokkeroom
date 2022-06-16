import jwt from 'jsonwebtoken'

function jwtTokens({id, nickname, email}) {
    const user = {id, nickname, email}
    const accesToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'20s'})
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'5m'})
    return ({accesToken,refreshToken})
}

export {jwtTokens}