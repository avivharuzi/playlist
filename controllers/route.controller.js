module.exports.problem = (res) => {
    return res.json({
        response: false,
        message: 'There was problem with this request'
    });
};
