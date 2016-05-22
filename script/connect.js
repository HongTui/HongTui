var config_ajax = {
	local: {
		'type': 'GET',
		'login': './script/json/login.json',
		'userInfo': './script/json/userInfo.json',
		'getMedia': './script/json/selfMedia.json',
		'operFav': './script/json/operFav.json',
<<<<<<< HEAD
		'cart':'./script/json/Cart.json',
		'getfavo':'./script/json/selfMedia.json'
=======
		"getCart": './script/json/getCart.json'
>>>>>>> 279b96d03826c77c55bfbeec636d16da07bd74ee
	},
	server: {
		'type': 'POST',
		'login': '/Token',
		'userInfo': '/Api/Account/UserInfo',
		'getMedia': '/Api/Media',
		'operFav': '/Api/Favo',
		'getCart': '/Api/Cart'
	}
};