function check(str, target) {
    let _arr = str.split("."),
        _target = target || this;

    if (!str) throw new Error("解析字符串不能为空。");
    else if (typeof str !== "string") throw new Error("解析字符串格式不正确。");

    if (_target instanceof Array) {
        _target = [].concat(_target);
    } else if (_target instanceof Object) {
        _target = Object.assign({}, _target);
    };

    for (let i = 0; i < _arr.length; i++) {
        if (_target === null || _target === undefined) return null;

        if (_target instanceof Array) {
            if (_target.length === 0 && _arr[i]) return null;
            else if (!isNaN(_arr[i]) && _target.length <= parseInt(_arr[i]))
                return null;
            else if (!isNaN(_arr[i]) && _target.length > parseInt(_arr[i]))
                _target = _target[_arr[i]];
            else _target = _target[0][_arr[i]];
        } else if (_target instanceof Object) {
            if (_target[_arr[i]] === null || _target[_arr[i]] === undefined)
                return null;
            else _target = _target[_arr[i]];
        } else {
            if (_arr[i]) return null;
            else return _target;
        }
    }
    return _target;
}
