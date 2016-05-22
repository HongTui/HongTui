$(function(){
    template.helper('fmtMoney', function(money, length, isYuan){
		return Util.fmtMoney(money, length, isYuan);
    })

	var config = {
		data: {
			Page: 0,
			PageSize: 10,
			TotalPage: 0,
			Category: ""
		},
		_envir: 'local'
	};
	var $result_list = $("#result-con");
	var $allCheck = $(".hongtui-result-box .checkbox2-box .checkbox2");

	function getList(){
		var ajaxParams = {
			url: config_ajax[config._envir].getCart,
			type: config_ajax[config._envir].type,
			data: {
				Page: config.data.Page,
				PageSize: config.data.PageSize
			},
			succFn: function(data){
				data.TotalPage = Math.ceil(data.TotalCount/data.PageSize) - 1;
				config.data.TotalPage = data.TotalPage;
				$result_list.html(template('temp_list', data));
				$("#page_flip").html(template('temp_flip', data))
			}
		};
		Util.requestAjaxFn(ajaxParams);
	};
	getList();
	//首页、上一页、下一页、末页
	$("#page_flip").on('click', '.homepage', function(){
		if($(this).hasClass('disabled')) return;

		config.data.Page = 0;
		getList();
	}).on('click', '.previous', function(){
		if($(this).hasClass('disabled')) return;
		
		var page = config.data.Page - 1;
		if(page >= 0){
			config.data.Page = page;
		}
		getList();
	}).on('click', '.next', function(){
		if($(this).hasClass('disabled')) return;
		
		var page = config.data.Page + 1;
		if(page <= config.data.TotalPage){
			config.data.Page = page;
		}
		getList();
	}).on('click', '.lastpage', function(){
		if($(this).hasClass('disabled')) return;

		config.data.Page = config.data.TotalPage;
		getList();
	})

	//点击删除触发事件
	$result_list.on('click', '.delete', function(){
		var $this = $(this);
		var ajaxParams = {
			url: config_ajax[config._envir].operFav,
			type: "DELETE",
			data: {
				Wid: $this.attr('data-id')
			},
			succFn: function(data){
				config.data.Page = 0;
				getList();
			}
		};
		Util.requestAjaxFn(ajaxParams);
	});

	//绑定选择框事件
	$result_list.on('click', '.checkbox2', function(){
		$(this).toggleClass('checked');
		getChoiceNum();
	})
	//绑定全选事件
	$allCheck.on('click', function(){
		$result_list.find(".checkbox2").toggleClass('checked');
		getChoiceNum();
	})
	//设置选中的个数
	function getChoiceNum(){
		var len = $result_list.find(".checkbox2.checked").length;
		$("#choise_num").html(len);
		if(len == $result_list.find(".checkbox2").length){
			$allCheck.addClass('checked');
		}else{
			$allCheck.removeClass('checked');
		}
	}
});








