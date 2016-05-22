var config_ajax = {
	local: {
		'type': 'GET',
		'login': './script/json/login.json',
		'userInfo': './script/json/userInfo.json',
		'getMedia': './script/json/selfMedia.json',
		'operFav': './script/json/operFav.json'
	},
	server: {
		'type': 'POST',
		'login': '/Token',
		'userInfo': '/Api/Account/UserInfo',
		'getMedia': '/Api/Media',
		'operFav': '/Api/Favo'
	}
};