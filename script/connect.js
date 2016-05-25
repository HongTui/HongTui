var config_ajax = {
	local: {
		'type': 'GET',
		'login': './script/json/login.json',
		'userInfo': './script/json/userInfo.json',
		'getMedia': './script/json/selfMedia.json',
		'operFav': './script/json/operFav.json',
		'cart':'./script/json/Cart.json',
		'getfavo':'./script/json/selfMedia.json',
		"getCart": './script/json/getCart.json',
		"order": './script/json/operFav.json',
		'CORS': ''
	},
	server: {
		'type': 'POST',
		'login': '/Token',
		'userInfo': '/Api/Account/UserInfo',
		'getMedia': '/Api/Media',
		'getfavo': '/Api/Favo',
		'getCart': '/Api/Cart',
		"order": '/Api/Order',
		'CORS': 'http://toufang.unity-ad.com'
	},
	envir: 'server'
};