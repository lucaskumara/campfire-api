const validateToken = (request, response, next) => {
    const flag1 = checkAuthorizationWasProvided(request);
    const flag2 = checkAuthorizationType(request);
    const flag3 = checkAuthorizationToken(request);

    const flags = [flag1, flag2, flag3];

    if (flags.includes(false)) {
        response.status(401);
        response.json({
            error: 401,
            message: 'Invalid authorization provided'
        })
        return;
    }

    next();
}

const checkAuthorizationWasProvided = (request) => {
    return request.headers.authorization != null;
}

const checkAuthorizationType = (request) => {
    const authorization = request.headers.authorization;

    if (authorization == null) {
        return false;
    }

    return authorization.split(' ')[0] == 'Bearer';
}

const checkAuthorizationToken = (request) => {
    const authorization = request.headers.authorization;

    if (authorization == null) {
        return false;
    }

    return authorization.split(' ')[1] == process.env.TOKEN
}

module.exports = validateToken;