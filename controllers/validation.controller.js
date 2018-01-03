module.exports = (value, reg) => {
    if (value !== '') {
        if (reg.test(value)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
