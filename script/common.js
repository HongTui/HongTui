
var Util = Util || {};

Util.cookie = {
	add: function(name, value, iDay, domain){
	    if(!iDay) return;

	    var oDate = new Date();
	    oDate.setDate(oDate.getDate() + iDay);
	    document.cookie = name + '=' + value + ';path=/;expires=' + oDate.toGMTString() + ';domain=' + (domain || '.souyidai.com');
	},
	get: function(name){
	    var cookies = document.cookie.split('; ');
	    for(var i = 0, len = cookies.length; i < len; i++){
	        var arr = cookies[i].split('=');
	        if(arr[0] == name) return arr[1];
	    }
	    return '';
	},
	del: function(name, domain){
		document.cookie = name + "=;path=/;expires=" + (new Date(0)).toGMTString() + ';domain=' + (domain || '.souyidai.com');
	}
};

Util.area = {
    /**
     * 获取所有省份信息
     * @return {array} 返回所有省份的数组
     */
    getProvince: function(){
        var province = [];
        var regProvince = /^\d{2}0{4}$/g;
        for(var code in areaCode.ALL){
            if(regProvince.test(code)){
                province.push(areaCode.ALL[code]);
            }
        }
        return province;
    },
    /**
     * 获取城市信息
     * @param  {int} pid 省份id
     * @return {array}   返回该省份下所有城市的数组
     */
    getCity: function(pid){
        if(pid === "-1" || pid === undefined) return [];

        var city = [];
        var regCity = new RegExp('^(' + pid.substring(0,2) + '\\d{2}0{2})$');
        for(var code in areaCode.ALL){
            if(regCity.test(code) && code != pid){
                city.push(areaCode.ALL[code]);
            }
        }
        if(city.length === 0){
            city.push(areaCode.ALL[pid]);
        }
        return city;
    },
    /**
     * 获取地区信息
     * @param  {int} cityid 城市id
     * @return {array}      返回该城市下所有地区/县的数组
     */
    getCounty: function(cityid){
        if(cityid === "-1" || cityid === undefined) return [];

        var c = cityid.substring(2, 6);
        c = c === '0000' ? (cityid.substring(0, 2) + '01') : cityid.substring(0, 4);
        var county = [];
        var regCounty = new RegExp('^(' + c + '\\d{2})$');
        for(var code in areaCode.ALL){
            if(regCounty.test(code) && code != cityid){
                county.push(areaCode.ALL[code]);
            }
        }
        if(county.length === 0){
            county.push(areaCode.ALL[cityid]);
        }
        return county;
    }
};

Util.getUrlParam = function(param){
    var reg_param = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
    var arr = window.location.search.substr(1).match(reg_param);
    if (arr && arr.length >= 2) {
        return arr[2];
    }else{
        return '';
    }
};

Util.fmtMoney = function(money, length, isYuan) {
	if(length != 0) length = length || 2;
    money *= 1;
    if (typeof money === 'number' && !isYuan) {
		money /= 100;
	}
    //toFixed取小数时四舍五入
    money = ('' + money.toFixed(length)).replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, "$1,");
	return money;
};

Util.resetMoney = function(money) {
	return ('' + money).replace(/,/g, '');
};

Util.addZero = function(t) {
	return t < 10 ? '0' + t : t;
};

Util.getStyle = function(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
};

Util.startMove = function(obj, json, options) {
    options = options || {};
    options.type = options.type || 'linear';
    options.time = options.time || 800;

    var count = Math.round(options.time / 30);
    var oNow = {};
    var dis = {};
    for (var key in json) {
        if (key == 'opacity') {
            oNow[key] = Math.round(parseFloat(Util.getStyle(obj, key) * 100));
            if (isNaN(oNow[key])) {
                oNow[key] = 100;
            }
        } else {
            oNow[key] = parseInt(Util.getStyle(obj, key));
        }

        if (!oNow[key]) {
            switch (key) {
                case 'left':
                    oNow[key] = obj.offsetLeft;
                    break;
                case 'top':
                    oNow[key] = obj.offsetTop;
                    break;
                case 'width':
                    oNow[key] = obj.offsetWidth;
                    break;
                case 'height':
                    oNow[key] = obj.offsetHeight;
                    break;
            }
        }

        dis[key] = json[key] - oNow[key];
    }

    var n = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        n++;
        for (var key in json) {
            switch (options.type) {
                case 'linear':
                    var a = n / count;
                    var iValue = oNow[key] + dis[key] * a;
                    break;
                case 'ease-in':
                    var a = n / count;
                    var iValue = oNow[key] + dis[key] * a * a * a;
                    break;
                case 'ease-out':
                    var a = 1 - n / count;
                    var iValue = oNow[key] + dis[key] * (1 - a * a * a);
                    break;
            }
            if (key == 'opacity') {
                obj.style.opacity = iValue / 100;
                obj.style.filter = 'alpha(opacity:' + iValue + ')';
            } else {
                obj.style[key] = iValue + 'px';
            }
        }
        if (n == count) {
            clearInterval(obj.timer);
            options.succFn && options.succFn();
        }
    }, 30);
};

Util.loadTips = function(tooltip,$elem){
    var tooltip = tooltip || "local_tooltip";
    var $par = $elem || $('[data-text]');
    var tips = codes && codes[tooltip];
    $par.not('input').each(function(i, item){
        var $this = $(this);
        var text = $this.attr("data-text");
        var show = text;
        if(tips && tips[text]){
            show = tips[text];
        }
        if($this.hasClass('tooltipcol')){
        	$this.attr("data-text", show);
        }else{
        	$this.html(show);
        }
        
    });
    
};

Util.setProgress = function(oCircle, $span) {
    if (!oCircle.getContext) return;

    //项目完成进度
    var oGC = oCircle.getContext("2d");
    var objColor = {
        "zero": "#e7e6e6",
        "small": "#ffd200",
        "midium": "#ff510d",
        "big": "#81c931"
    };
    var arrCircle = [];
    var x = 38,
        y = 40,
        lineWidth = 4,
        radius = 24;
    if ($(oCircle).attr("progress-detail") == "1") {
        //如果是详情页的进度条
        x = y = 26;
        radius = 22;
    }
    if ($(oCircle).attr("data-index") == "1") {
        //如果是首页的进度条
        x = y = 20;
        radius = 18;
    }
    if ($(oCircle).attr("data-dqb") == "true") {
        //如果是列表中的定期宝 需要向下一些
        y = 50;
    }
    oGC.clearRect(0, 0, $(oCircle).width(), $(oCircle).height());
    var bili = oCircle.getAttribute("data-precent") * 1;
    if ($span.html() == "") {
        $span.html(bili);
    }
    var type = bili == 0 ? "zero" : (bili > 0 && bili < 50 ? "small" : bili >= 50 && bili < 100 ? "midium" : "big");
    arrCircle.push({
        "color": objColor[type],
        "circle": bili
    });
    arrCircle.push({
        "color": "#ececec",
        "circle": 100 - bili
    });
    var isIE8 = !$.support.changeBubbles; //如果不支持，则为IE8及以下浏览器

    var lastAngle = 0;
    for (var i = 0; i < arrCircle.length; i++) {
        if (lastAngle == 270) break;

        var angle = arrCircle[i].circle / 100 * 360;
        var start = i == 0 ? -90 : lastAngle;
        var end = lastAngle = start + angle;
        if (end == 270 && isIE8) end = -90; //该处为了兼容ie8下： -90 到 270 整圆画不出来的bug
        oGC.beginPath();
        oGC.arc(x, y, radius, start / 180 * Math.PI, end / 180 * Math.PI);
        oGC.strokeStyle = arrCircle[i].color;
        oGC.lineWidth = lineWidth;
        oGC.stroke();
        oGC.closePath();
    };
};

Util.getMonthNum = function(m, y){
  var d = new Date();
  d.setDate(1);
  d.setFullYear(y, m + 1, 0);
  return d.getDate();
};

//子类继承父类
Util.extend = function(childClass, parentClass){
    var newClass = function(){};
    newClass.prototype = parentClass.prototype;
    childClass.prototype = new newClass();
    childClass.prototype.constructor = childClass;
};

Util.Browser = function() {
    var a = navigator.userAgent.toLowerCase();
    var u = navigator.userAgent;
    var b = {};
    b.isStrict = document.compatMode == "CSS1Compat";
    b.isFirefox = a.indexOf("firefox") > -1;
    b.isOpera = a.indexOf("opera") > -1;
    b.isSafari = (/webkit|khtml/).test(a);
    b.isSafari3 = b.isSafari && a.indexOf("webkit/5") != -1;
    b.isIE = !b.isOpera && a.indexOf("msie") > -1;
    b.isIE6 = !b.isOpera && a.indexOf("msie 6") > -1;
    b.isIE7 = !b.isOpera && a.indexOf("msie 7") > -1;
    b.isIE8 = !b.isOpera && a.indexOf("msie 8") > -1;
    b.isGecko = !b.isSafari && a.indexOf("gecko") > -1;
    b.isMozilla = document.all != undefined && document.getElementById != undefined && !window.opera != undefined;
    b.isTrident = u.indexOf('Trident') > -1;
    b.isPresto = u.indexOf('Presto') > -1;
    b.isWebKit = u.indexOf('AppleWebKit') > -1;
    b.isGecko = u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1;
    b.isMobile = !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/);
    b.isios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    b.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    b.isiPhone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
    b.isiPad = u.indexOf('iPad') > -1;
    b.isWebApp = u.indexOf('Safari') == -1;
    return b;
} ();

String.prototype.lengthStr = function() {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) {
            len += 2
        } else {
            len++
        }
    }
    return len
};

Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    };
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f": "\u5468") : "") + week[this.getDay() + ""])
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    };
    return fmt;
};

//随机得到某个范围之内的随机数
Util.getRandom = function(m,n){
    return Math.round(Math.random() * (n - m) + m);
};

//公用ajax请求
Util.requestAjaxFn = function(options){
    var data = (options && options.data) || {};
    data.t = Math.random();

    $.ajax({
        url: options.url,
        type: options.type || 'POST',
        dataType: options.dataType || 'json',
        async:options.async == false ? false : true,
        data: data
    })
    .done(function(data) {
        if(data.errorCode == 1 && data.errorMessage == "noLogin"){
            window.location.href = "https://passport.souyidai.com?backurl=" + document.URL;
            return;
        }

        options.succFn && options.succFn(data);
    })
    .fail(function() {
        options.errorFn && options.errorFn(data);
    });
    
};

//时间戳转成yyyy-MM-dd
Util.transferTime = function(num){
    var d = new Date(num),
        year =d.getFullYear(),
        month = (d.getMonth()+1 < 10)? ("0"+(d.getMonth()+1)):(d.getMonth()+1),
        day = (d.getDate() < 10)? ("0"+d.getDate()):d.getDate(),
        hour = (d.getHours() < 10)? ("0"+d.getHours()):d.getHours(),
        minute = (d.getMinutes() < 10)? ("0"+d.getMinutes()):d.getMinutes(),
        second = (d.getSeconds() < 10)? ("0"+d.getSeconds()):d.getSeconds();
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
};
//获取当前服务器时间，判断所给的日期是否大于当前时间且在同一个月
Util.dateCompare = function(serverTime,givenTime){
    var reg = /[-\s:]/g,
        serverArr = serverTime.split(" ")[0],
        givenArr = givenTime.split(" ")[0],
        minus = (new Date(givenArr) - new Date(serverArr))/(1000*60*60*24) ;
    if(minus>=0 &&minus <= 10){
        return true;
    }
    return false;
};
//判断当前服务器日期 与 所给日期 比较  ，返回天数
Util.getDays = function(serverTime,givenTime){
    var obj={},
        serverArr = serverTime.split(" ")[0],
        givenArr = givenTime.split(" ")[0],
        minus = (new Date(serverArr) - new Date(givenArr))/(1000*60*60*24) ;
    if(minus>0){
        obj["bool"] = true;
    }else{
        obj["bool"] = false;
    }
    obj["num"] = Math.abs(minus);
    return obj;
};
Util.bankName = {
    "00":"民生银行",
    "01":"工商银行",
    "02":"中国银行",
    "03":"建设银行",
    "04":"农业银行",
    "05":"交通银行",
    "06":"招商银行",
    "07":"兴业银行",
    "08":"中信银行",
    "09":"光大银行",
    "10":"平安银行",
    "11":"华夏银行",      //新加
    "12":"邮政储蓄银行",
    "13":"北京银行",
    "14":"广发银行",
    "15":"浦发银行",
    "16":"浙商银行",      //新加/
    "19":"江苏银行",      //新加
    "20":"上海银行",      //新加
    "29":"渤海银行"       //新加
}
Util.bankSimplify = {
    "00":"cmbc",
    "01":"icbc",
    "02":"boc",
    "03":"ccb",
    "04":"abc",
    "05":"comm",
    "06":"cmb",
    "07":"cib",
    "08":"citic",
    "09":"ceb",
    "10":"szpab",
    "11":"huaxia",      //新加
    "12":"psbc",
    "13":"bccb",
    "14":"gdb",
    "15":"spdb",
    "16":"zheshang",    //新加
    "19":"jiangsu",     //新加
    "20":"shanghai",    //新加
    "29":"bohai"        //新加
};
Util.bankNameToNum = {
    "cmbc":'00',
    "icbc":'01',
    "boc":'02',
    "ccb":'03',
    "abc":'04',
    "comm":'05',
    "cmb":'06',
    "cib":'07',
    "citic":'08',
    "ceb":'09',
    "szpab":'10',
    "huaxia":'11',      //新加
    "psbc":'12',
    "bccb":'13',
    "gdb":'14',
    "spdb":'15',
    "zheshang":'16',    //新加
    "jiangsu":'19',     //新加
    "shanghai":'20',    //新加
    "bohai":'29'        //新加
};
Util.mailSuffix = {
    "126.com": {
        "suffix": "126",
        "url": "http://www.126.com"
    },
    "vip.126.com": {
        "suffix": "126",
        "url": "http://vip.126.com"
    },
    "163.com": {
        "suffix": "163",
        "url": "http://mail.163.com"
    },
    "yeah.net": {
        "suffix": "163",
        "url": "http://mail.yeah.net"
    },
    "vip.163.com": {
        "suffix": "163",
        "url": "http://vip.163.com"
    },
    "vip.188.com": {
        "suffix": "163",
        "url": "http://vip.188.com/"
    },
    "qq.com": {
        "suffix": "qq",
        "url": "http://mail.qq.com"
    },
    "vip.qq.com": {
        "suffix": "qq",
        "url": "http://mail.qq.com"
    },
    "foxmail.com": {
        "suffix": "qq",
        "url": "http://mail.qq.com"
    },
    "sohu.com": {
        "suffix": "sohu",
        "url": "http://mail.sohu.com/"
    },
    "vip.sohu.com": {
        "suffix": "sohu",
        "url": "http://vip.sohu.com/"
    },
    "sina.com": {
        "suffix": "sina",
        "url": "http://mail.sina.com.cn"
    },
    "vip.sina.com": {
        "suffix": "sina",
        "url": "http://mail.sina.com.cn"
    },
    "sina.cn": {
        "suffix": "sina",
        "url": "http://mail.sina.com.cn"
    },
    "tom.com": {
        "suffix": "tom",
        "url": "http://mail.tom.com"
    },
    "163.net": {
        "suffix": "tom",
        "url": "http://mail.163.net"
    },
    "21cn.com": {
        "suffix": "21cn",
        "url": "http://mail.21cn.com"
    },
    "vip.21cn.com": {
        "suffix": "21cn",
        "url": "http://mail.21cn.com/vip"
    },
    "139.com": {
        "suffix": "139",
        "url": "http://mail.10086.cn"
    },
    "wo.cn": {
        "suffix": "wo",
        "url": "http://mail.wo.cn"
    },
    "hexun.com": {
        "suffix": "hexun",
        "url": "http://mail.hexun.com"
    },
    "outlook.com": {
        "suffix": "microsoft",
        "url": "http://outlook.com"
    },
    "hotmail.com": {
        "suffix": "microsoft",
        "url": "http://outlook.com"
    },
    "live.com": {
        "suffix": "microsoft",
        "url": "http://outlook.com"
    },
    "live.cn": {
        "suffix": "microsoft",
        "url": "http://outlook.com"
    },
    "gmail.com": {
        "suffix": "gmail",
        "url": "http://gmail.com"
    },
    "yahoo.com": {
        "suffix": "yahoo",
        "url": "http://mail.yahoo.com"
    }
};


Util.validOperation = function(){
    $('body').attr('data-type', 'cmbc-container');

    function TmpOpt(options){
        options = options || {};
        //获取按钮自定义变量
        this.$Popup = $(".version-popup[data-type='version-popup-mobel']");      //内容弹层父级
        this.$Main = this.$Popup.find(".version-popup-main");  //内容弹出层
        this.$Mask = this.$Popup.find(".version-popup-mask");
        this.$Floats = $(".popup-mask,.version1-mask"); //遮罩层

        this.$container = $('[data-type="cmbc-container"]'); //最外部容器
        /*this.$popMask = $('.popup-mask'); //弹层黑色背景
        this.$contentC = $('.version-popup'); //弹层内容容器*/
        this.$cancelBtn = '[data-type="popup-cancel"],.submitBtn'; //取消按钮
        this.$beginTransfer = '[data-type="begin-transfer"]'; //开始迁移
        this.$tranferNow = '[data-type="transfer-now"]'; //立即迁移
        this.$noTransfer = '[data-type="no-transfer"]'; //暂不迁移
        this.$bindCard = '[data-type="bind-card"]'; //立即绑卡
        this.$noBind = '[data-type="no-bind"]'; //暂不绑卡
        this.$setNow = '[data-type="set-now"]'; //立即设置
        this.$openAcc = '[data-type="open-acc"]'; //立即开通民生托管账户（安全中心）
        this.$form = '[data-type="form-submit"]'; //form表单
        this.$bankCustody = '[data-type="bank-custody"]'; //银行托管
        this.$checkBox = '[data-type="check-box"]'; //协议 (选择/不选择)元素
        this.config = {
            url: options.url || 'src_safecenter',
            // isBind: options.isBind || false,
            isBuildEle: options.isBuildEle || false,
            // isBindCardBlocked: options.isBindCardBlocked || false,
            currentPageFn: options.currentPageFn,
            type: options.type || 1,         //页面加载时检测深度（1-只检测老用户，2-检测新用户和老用户，3-检测新用户、老用户、绑卡）
            //（检测托管时）是否包含中间状态 1托管民生中，2 民生银行那边托管成功,但我方复核审核中,需要民生绑卡成功才进行更改
            isContainInterStatus: options.isContainInterStatus || 1,  //1-不包含中间状态；2-包含中间状态  
            isDepositBtn: options.isDepositBtn || false,     //是否是充值页面点击的充值按钮触发的
            isQuickChargeBtn: options.isQuickChargeBtn || false     //是否是充值页面点击的快捷绑卡按钮触发的
        };
        this.init();
    }
    //初始化
    TmpOpt.prototype.init = function(){
        this.config.isBuildEle && this.buildEle();
        this.BtnsClick();
    }
    //创建页面元素
    TmpOpt.prototype.buildEle = function(){
        $('[data-type="popup-mask"]').length<1&&$("body").append('<div class="popup-mask" data-type="popup-mask"></div>');
        $('[data-type="popup-content"]').length<1&&$("body").append('<div data-type="popup-content"></div>');
        $("body").append('<style>.popup-mask{display:block;position:absolute;left:0;top:0;z-index:100;background:#000;opacity:.3;filter:alpha(opacity=30);} .version-popup{left: 50%;margin-left: -300px;z-index:200;}</style>');
        //$("body").append('<script language="javascript" src="https://static.souyidai.com/www/js/templatejs/'+url+'.js"></script>');
    }
    //按钮点击事件
    TmpOpt.prototype.BtnsClick = function(){
        var _this = this;
        //充值弹层模板按钮点击事件绑定
        this.$container.off("click.cancelBtn").on("click.cancelBtn",this.$cancelBtn,function(){ //取消按钮
            _this.$Main.html("");
            _this.closePopup();
        });
        //引导迁移
        this.$container.off("click.beginTransfer").on("click.beginTransfer",this.$beginTransfer,function(){ 
            _this.$Main.html(template(_this.config.url + "/transfer_bengin"));
            _this.openPopup();
            Util.loadTips(false,_this.$Main.find("[data-text]"));
        }); 
        //协议勾选
        this.$container.off("click.checkBox").on("click.checkBox",this.$checkBox,function(){ 
            var $this = $(this),
                $cr = $('[data-type="cmbc-container"] .checked-related');;
            if($this.hasClass("checked")){
                $this.removeClass("checked");
                $cr.addClass("disabled").prop("disabled",true);
            }else{
                 $this.addClass("checked");
                 $cr.removeClass("disabled").prop("disabled",false);
            }
        }); 
        //立即迁移
        this.$container.off("click.tranferNow").on("click.tranferNow",this.$tranferNow,function(){ 
            _this.$Main.html(template(_this.config.url + "/transfer_now"));
            _this.openPopup();
            Util.loadTips(false,_this.$Main.find("[data-text]"));
        });
        //立即设置点击    
        this.$container.off("click.setNow").on("click.setNow",this.$setNow,function(){
            var params = {
                url: "https://www.souyidai.com/myaccount/openTransBankCustody",
                succFn:function(data){
                    if(data.errorCode == 0){
                        var $formSubmit = $('[data-type="form-submit"]');
                        if($formSubmit.length == 0){
                            $("body").append("<form data-type='form-submit' action='' type='post' target='_blank'><input type='hidden' name='context' /></form>");
                            $formSubmit = $("body").find("[data-type='form-submit']");
                        }
                        
                        $formSubmit.attr("action",data.data.actionUrl).find("input").val(data.data.context);
                        $formSubmit.submit();
                    }
                }
            }
            Util.requestAjaxFn(params);
        });
        //暂不迁移 
        this.$container.off("click.noTransfer").on("click.noTransfer",this.$noTransfer,function(){ 
            _this.$Main.html(template(_this.config.url + "/no_transfer"));
            _this.openPopup();
            Util.loadTips(false,_this.$Main.find("[data-text]"));
        }); 
        //银行托管点击    
        this.$container.off("click.bankCustody").on("click.bankCustody",this.$bankCustody,function(){
            _this.linkTo('open_d_acc');
        });
        //绑定取现卡   
        this.$container.off("click.bindCard").on("click.bindCard",this.$bindCard,function(){
            _this.linkTo('open_d_bind');
        });
    }
    //引导迁移弹出层
    TmpOpt.prototype.transferBegin = function(){
        this.$Main.html(template(this.config.url + "/transfer_begin"));
        this.openPopup();
        Util.loadTips(false,this.$Main.find("[data-text]"));
    }
    //引导迁移弹出层(充值页面点击充值按钮，如果是老用户引导该弹层迁移)
    TmpOpt.prototype.depositBtnTransferBegin = function(){
        this.$Main.html(template(this.config.url + "/can_not_charge"));
        this.openPopup();
        Util.loadTips(false,this.$Main.find("[data-text]"));
    }
    //取现 绑卡拦截
    TmpOpt.prototype.bindCardBlocked = function(){
        this.$Main.html(template(this.config.url + "/can_not_bind"));
        this.openPopup();
        Util.loadTips(false,this.$Main.find("[data-text]"));
    }
    //引导到安全中心绑卡页面
    TmpOpt.prototype.guideBindPage = function(){
        this.linkTo('open_d_bind');
    };
    //引导到快捷绑卡
    TmpOpt.prototype.guideQuickBindCard = function(){
        Util.cookie.add("sc_open_kjk","1",1);
        this.linkTo('open_d_bind');
    };
    //银行托管弹出层
    TmpOpt.prototype.realName = function(){
        this.$Main.html(template(this.config.url + "/real_name"));
        this.openPopup();
    };
    //弹层显示-宽高控制以及内容位置的控制
    TmpOpt.prototype.openPopup = function(){
        var winW = $(window).width(),
            winH = $(window).height(),
            dW = $(document).width(),
            dH = $(document).height(),
            left = (winW - this.$Popup.width()) / 2,
            top = (winH - this.$Popup.height()) / 2;

        this.$Main.show();
        this.$Floats.show().css("width", dW + 'px').css("height", dH + 'px');
        this.$Popup.show().css("top", top + $(window).scrollTop() + 'px');
        this.$Mask.height(this.$Main.height() + 16);
    };
    //弹层关闭
    TmpOpt.prototype.closePopup = function(){
        this.$Main.hide();
        this.$Floats.hide();
        this.$Popup.hide();
    };
    //链接跳转并添加cookie
    TmpOpt.prototype.linkTo = function(hash, boo){
        this.closePopup();
        var gotourl = '/myaccount/safecenter';
        Util.cookie.add("sc_open", "1", 1);
        if(gotourl == location.pathname){
            location.hash = '#' + hash;
            this.config.currentPageFn && this.config.currentPageFn();
        }else{
            !!boo ? window.open(href,"_blank") : location.href = gotourl + '#' + hash;    
        }
        
    };

    /*
    查看用户是否开户、绑卡
    返回：
        1 - 尚未民生开户、尚未实名认证 ——》（新用户，引导实名认证开户）
        2 - 尚未民生开户、已实名认证 ——》（老用户，引导账户迁移）
        3 - 已民生开户、未绑定民生取现、民生快捷卡 ——》绑定拦截，引导去绑卡
        4 - 已民生开户、已绑定民生取现或民生快捷卡 ——》 直接去绑卡页面
    */
    //实名、迁移和绑卡拦截
    TmpOpt.prototype.rtValidate = function(afterFn){
        var _this = this;
        var params = {
            url: "/myaccount/isopenCustody",
            succFn:function(data){
                if(data.errorCode == 0){    //bankCustody 民生托管,id5Status 实名认证,bankcardBand 民生银行绑卡 
                    var bankCustody = data.data.bankCustody,
                        id5Status = data.data.id5Status,
                        bankcardBand = data.data.bankcardBand,
                        result = false;

                    //1、老实名用户（未托管）；2、新用户/老非实名用户（未托管）；3、待认证港澳台用户（托管中）；4、已托管成功用户（包括大陆用户、港澳台用户）；
                    var curStatus = 2;
                    if(bankCustody == 2){
                        curStatus = 3;
                    }else if(bankCustody == 3){
                        curStatus = 4;
                    }else if(id5Status == 3 && (bankCustody == 0 || bankCustody == 4) ){
                        curStatus = 1;
                    }else if(id5Status == 0 && (bankCustody == 0 || bankCustody == 4) ){
                        curStatus = 2;
                    }

                    switch(_this.config.type){
                        case 1:
                            if(curStatus == 1){
                                _this.transferBegin();
                            }else{
                                //如果不包含中间状态且正好是中间状态，需要提示新开户
                                if(_this.config.isContainInterStatus == 1 && (bankCustody == 1 || bankCustody == 2)){
                                    _this.realName();
                                }else{
                                    result = true;
                                }
                            }
                            break;
                        case 2:
                            if(curStatus == 1){
                                if(_this.config.isDepositBtn){
                                    _this.depositBtnTransferBegin();
                                }else{
                                    _this.transferBegin();
                                }
                            }else if(curStatus == 2){
                                _this.realName(); //新用户
                            }else{
                                if(_this.config.isQuickChargeBtn){
                                    _this.guideQuickBindCard();
                                }else{
                                    //如果不包含中间状态且正好是中间状态，需要提示新开户
                                    if(_this.config.isContainInterStatus == 1 && (bankCustody == 1 || bankCustody == 2)){
                                        _this.realName();
                                    }else{
                                        result = true;
                                    }
                                }
                            }
                            break;
                        case 3:
                            switch(curStatus){
                                case 1: _this.transferBegin();
                                    break;
                                case 2: _this.realName();
                                    break;
                                case 3:
                                case 4: _this.guideBindPage();
                                    break;
                            }
                            break;
                    }
                    afterFn && afterFn(result);

                    //判断如果未开户，返回false
                    /*var isCustody = _this.config.isContainInterStatus ? (bankCustody == 0 || bankCustody == 4) : (bankCustody != 3);
                    if(isCustody){
                        //判断之前是否有过实名认证（老用户）
                        if(id5Status != 3){
                            if(_this.config.type >= 2){
                                _this.realName(); //新用户  
                            }else{
                                result = true;
                            }
                        }else{
                            _this.transferBegin(); //老用户
                        }
                    }else{
                        if(_this.config.type <= 2){
                            result = true;
                        }
                        //且需要判定到绑卡，则返回false
                        else if(bankcardBand != 2 && bankcardBand != 3){
                            _this.bindCardBlocked();
                        }else if(bankcardBand == 2 || bankcardBand == 3){
                            _this.guideBindPage();
                        }
                    }*/
                }
            }
        };
        Util.requestAjaxFn(params);
    };
    return TmpOpt;
}();

//datepicker插件
!function( $ ) {
    if(!$) return;
    // Picker object
    
    var Datepicker = function(element, options){
        this.element = $(element);
        this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||'mm/dd/yyyy');
        this.picker = $(DPGlobal.template).appendTo('body').hide().on('mousedown.Datepicker',$.proxy(this.mousedown, this)).on('click.Datepicker',$.proxy(this.click, this));

        this.isInput = this.element.is('input') || this.element.is('textarea');
        this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
        
        if (this.isInput) {
            this.element.on({
                "focus.Datepicker": $.proxy(this.show, this),
                "click.Datepicker": $.proxy(this.show, this),
                "blur.Datepicker": $.proxy(this.blur, this),
                "keyup.Datepicker": $.proxy(this.update, this),
                "keydown.Datepicker": $.proxy(this.keydown, this)
            });
        } else {
            if (this.component){
                this.component.on('click.Datepicker', $.proxy(this.show, this));
            } else {
                this.element.on('click.Datepicker', $.proxy(this.show, this));
            }
        }
        
        this.viewMode = 0;
        this.weekStart = options.weekStart||this.element.data('date-weekstart')||0;
        this.scroll = (options.scroll != undefined ? options.scroll : true);
        this.weekEnd = this.weekStart == 0 ? 6 : this.weekStart - 1;
        this.fillDow();
        this.fillMonths();
        this.update();
        this.showMode();
    };
    
    Datepicker.prototype = {
        constructor: Datepicker,
        
        show: function(e) {
          $('div.datepicker.dropdown-menu').hide(); //make sure to hide all other calendars
            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
            this.place();
            $(window).on('resize.Datepicker', $.proxy(this.place, this));
            $('body').on('click.Datepicker', $.proxy(this.hide, this));
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (!this.isInput) {
                $(document).on('mousedown.Datepicker', $.proxy(this.hide, this));
            }
            this.element.trigger({
                type: 'show',
                date: this.date
            });
            // make sure we see the datepicker
            var elem = this.picker;
            var docScrollTop = $(document).scrollTop();
            var winHeight = $(window).height();
            var elemTop = elem.position().top;
            var elemHeight = elem.height();
            if (this.scroll && docScrollTop+winHeight<elemTop+elemHeight)
                          $(document).scrollTop(elemTop-elemHeight);
        },
        
        setValue: function() {
            var formated = DPGlobal.formatDate(this.date, this.format);
            if (!this.isInput) {
                if (this.component){
                    this.element.find('input').prop('value', formated);
                }
                this.element.data('date', formated);
            } else {
                this.element.prop('value', formated);
            }
        },
        
        place: function(){
            var offset = this.component ? this.component.offset() : this.element.offset();
            this.picker.css({
                top: offset.top + this.height,
                left: offset.left
            });
        },
        
        update: function(){
          var date = this.element.val();
            this.date = DPGlobal.parseDate(
                date ? date : this.element.data('date'),
                this.format
            );
            this.viewDate = new Date(this.date);
            this.fill();
        },
        
        fillDow: function(){
            var dowCnt = this.weekStart;
            var html = '<tr>';
            while (dowCnt < this.weekStart + 7) {
                html += '<th class="dow">'+DPGlobal.dates.daysMin[(dowCnt++)%7]+'</th>';
            }
            html += '</tr>';
            this.picker.find('.datepicker-days thead').append(html);
        },
        
        fillMonths: function(){
            var html = '';
            var i = 0
            while (i < 12) {
                html += '<span class="month">'+DPGlobal.dates.monthsShort[i++]+'</span>';
            }
            this.picker.find('.datepicker-months td').append(html);
        },
        
        fill: function() {
            var d = new Date(this.viewDate),
                year = d.getFullYear(),
                month = d.getMonth(),
                currentDate = this.date.valueOf();
            this.picker.find('.datepicker-days th:eq(1)')
                        .text(DPGlobal.dates.months[month]+' '+year);
            var prevMonth = new Date(year, month-1, 28,0,0,0,0),
                day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
            prevMonth.setDate(day);
            prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7)%7);
            var nextMonth = new Date(prevMonth);
            nextMonth.setDate(nextMonth.getDate() + 42);
            nextMonth = nextMonth.valueOf();
            html = [];
            var clsName;
            while(prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getDay() == this.weekStart) {
                    html.push('<tr>');
                }
                clsName = '';
                if (prevMonth.getMonth() < month) {
                    clsName += ' old';
                } else if (prevMonth.getMonth() > month) {
                    clsName += ' new';
                }
                if (prevMonth.valueOf() == currentDate) {
                    clsName += ' active';
                }
                html.push('<td class="day'+clsName+'">'+prevMonth.getDate() + '</td>');
                if (prevMonth.getDay() == this.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setDate(prevMonth.getDate()+1);
            }
            this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
            var currentYear = this.date.getFullYear();
            
            var months = this.picker.find('.datepicker-months')
                        .find('th:eq(1)')
                            .text(year)
                            .end()
                        .find('span').removeClass('active');
            if (currentYear == year) {
                months.eq(this.date.getMonth()).addClass('active');
            }
            
            html = '';
            year = parseInt(year/10, 10) * 10;
            var yearCont = this.picker.find('.datepicker-years')
                                .find('th:eq(1)')
                                    .text(year + '-' + (year + 9))
                                    .end()
                                .find('td');
            year -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="year'+(i == -1 || i == 10 ? ' old' : '')+(currentYear == year ? ' active' : '')+'">'+year+'</span>';
                year += 1;
            }
            yearCont.html(html);
        },
        
        blur:function(e) {
    },
        
        hide: function(e){
        this.picker.hide();
            $(window).off('resize.Datepicker', this.place);
            this.viewMode = 0;
            this.showMode();
            if (!this.isInput) {
                $(document).off('mousedown.Datepicker', this.hide);
            }
            $('body').off('click.Datepicker',$.proxy(this.click, this));
        },
        click:function(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        mousedown: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target).closest('span, td, th');
            if (target.length == 1) {
                switch(target[0].nodeName.toLowerCase()) {
                    case 'th':
                        switch(target[0].className) {
                            case 'switch':
                                this.showMode(1);
                                break;
                            case 'prev':
                            case 'next':
                                this.viewDate['set'+DPGlobal.modes[this.viewMode].navFnc].call(
                                    this.viewDate,
                                    this.viewDate['get'+DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate) + 
                                    DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1)
                                );
                                this.fill();
                                break;
                        }
                        break;
                    case 'span':
                        if (target.is('.month')) {
                            var month = target.parent().find('span').index(target);
                            this.viewDate.setMonth(month);
                        } else {
                            var year = parseInt(target.text(), 10)||0;
                            this.viewDate.setFullYear(year);
                        }
                        this.showMode(-1);
                        this.fill();
                        break;
                    case 'td':
                        if (target.is('.day')){
                            var day = parseInt(target.text(), 10)||1;
                            var month = this.viewDate.getMonth();
                            if (target.is('.old')) {
                                month -= 1;
                            } else if (target.is('.new')) {
                                month += 1;
                            }
                            var year = this.viewDate.getFullYear();
                            this.date = new Date(year, month, day,0,0,0,0);
                            this.viewDate = new Date(year, month, day,0,0,0,0);
                            this.fill();
                            this.setValue();
                            this.element.trigger({
                                type: 'changeDate',
                                date: this.date
                            });
                            this.hide();
                        }
                        break;
                }
            }
        },
        keydown:function(e) {
                  var keyCode = e.keyCode || e.which; 
                  if (keyCode == 9) this.hide(); // when hiting TAB, for accessibility
                },
    
        showMode: function(dir) {
            if (dir) {
                this.viewMode = Math.max(0, Math.min(2, this.viewMode + dir));
            }
            this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
        },
        
        destroy: function() { this.element.removeData("datepicker").off(".Datepicker"); this.picker.remove() }
    };
    
    $.fn.datepicker = function ( option ) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('datepicker'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
            }
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.datepicker.defaults = {
    };
    $.fn.datepicker.Constructor = Datepicker;
    
    var DPGlobal = {
        modes: [
            {
                clsName: 'days',
                navFnc: 'Month',
                navStep: 1
            },
            {
                clsName: 'months',
                navFnc: 'FullYear',
                navStep: 1
            },
            {
                clsName: 'years',
                navFnc: 'FullYear',
                navStep: 10
        }],
        dates:{
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            //daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            //months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        },
        parseFormat: function(format){
            var separator = format.match(/[.\/-].*?/),
                parts = format.split(/\W+/);
            if (!separator || !parts || parts.length == 0){
                throw new Error("Invalid date format.");
            }
            return {separator: separator, parts: parts};
        },
        parseDate: function(date, format) {
          var today=new Date();
          if (!date) date="";
            var parts = date.split(format.separator),
                date = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0),
                val;
            if (parts.length == format.parts.length) {
                for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10)||1;
                    switch(format.parts[i]) {
                        case 'dd':
                        case 'd':
                            date.setDate(val);
                            break;
                        case 'mm':
                        case 'm':
                            date.setMonth(val - 1);
                            break;
                        case 'yy':
                            date.setFullYear(2000 + val);
                            break;
                        case 'yyyy':
                            date.setFullYear(val);
                            break;
                    }
                }
            }
            return date;
        },
        formatDate: function(date, format){
            var val = {
                d: date.getDate(),
                m: date.getMonth() + 1,
                yy: date.getFullYear().toString().substring(2),
                yyyy: date.getFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            var date = [];
            for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                date.push(val[format.parts[i]]);
            }
            return date.join(format.separator);
        },
        headTemplate: '<thead>'+
                            '<tr>'+
                                '<th class="prev"><</th>'+
                                '<th colspan="5" class="switch"></th>'+
                                '<th class="next">></th>'+
                            '</tr>'+
                        '</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
    };
    DPGlobal.template = '<div class="datepicker dropdown-menu">'+
                            '<div class="datepicker-days">'+
                                '<table class=" table-condensed">'+
                                    DPGlobal.headTemplate+
                                    '<tbody></tbody>'+
                                '</table>'+
                            '</div>'+
                            '<div class="datepicker-months">'+
                                '<table class="table-condensed">'+
                                    DPGlobal.headTemplate+
                                    DPGlobal.contTemplate+
                                '</table>'+
                            '</div>'+
                            '<div class="datepicker-years">'+
                                '<table class="table-condensed">'+
                                    DPGlobal.headTemplate+
                                    DPGlobal.contTemplate+
                                '</table>'+
                            '</div>'+
                        '</div>';

}( window.jQuery )
