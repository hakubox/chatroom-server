Notification.requestPermission(function (status) {
    if (Notification.permission !== status) {
        Notification.permission = status;
    }
});

let notice = new Notification("新力项目库平台", {
    icon: "http://xinli.standard.36cpa.cn/static/images/logo.png",
    image: "http://cpa.file.36cpa.cn/graphic/260X190_0_0_0_sunac201811289831153c0f006e81a91c6cdf9e0b84f3.jpg",
    body: "当前住宅信息发生变化，请保持密切关注" + (index++),
    renotify: false,
    tag: 'newmsg'
});

notice.onshow = function() {
    //5秒后关闭消息框
    setTimeout(function() {
        n.close();
    }, 5000);
};
notice.onclick = function() {
    window.open('http://xinli.standard.36cpa.cn/#/login');
    n.close();
};
notice.onerror = function(err) {
    console.log('notification encounters an error');
    //do something useful
};
notice.onclose = function() {
};