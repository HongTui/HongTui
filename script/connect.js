var config_ajax = {
	local: {
		'type': 'GET',
		'login': './script/json/login.json',
		'userInfo': './script/json/userInfo.json'
	},
	server: {
		'type': 'POST',
		'login': '/Token',
		'userInfo': '/Api/Account/UserInfo'
	}
};