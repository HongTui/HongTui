$(function(){
	var $name = $('#login-phone'),
		$pwd = $('#login-pwd'),
		$error = $('.login-error');
	var _envir = 'local';

	$('.login-in input').on('focus', function(){
		$error.html('');
		$(this).val('');
	})

	$('.login-submit').on('click', function(){
		if($.trim($name.val()) == ''){
			$error.html('请输入邮箱／手机号码！');
			return;
		}
		if($.trim($pwd.val()) == ''){
			$error.html('请输入登录密码！');
			return;
		}

		var params = {
			url: config_ajax[_envir].login,
			type: config_ajax[_envir].type,
			data: {
				username: $.trim($name.val()),
				password: $.trim($pwd.val()),
				grant_type: 'password',
				client_id: 'hongtui',
				client_secret: 'hongtui'
			},
			succFn: function(data){
				if(data.errorCode == 0){
					//成功
					config_ajax.token = data.access_token;
				}
			}
		};
		Util.requestAjaxFn(params);
	});
})