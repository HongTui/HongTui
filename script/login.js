$(function(){
	var $name = $('#login-phone'),
		$pwd = $('#login-pwd'),
		$error = $('.login-error');

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

		$.post('http://toufang.unity-ad.com/Token', {
		    username: $.trim($name.val()),
		    password: $.trim($pwd.val()),
		    grant_type: 'password',
		    client_id: 'hongtui',
		    client_secret: 'hongtui'
		}, function(data) {
		    config_ajax.token = data.access_token;
		    Util.cookie.add('token', data.access_token, 1);
		    Util.cookie.add('username', data.userName, 1);
		    window.location.href = 'personal-center.html';
		});
	});
})