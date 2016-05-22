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
		}
	};
	function getList(){
		var ajaxParams = {
			url: config_ajax[config_ajax.envir].getfavo,
			type: config_ajax[config_ajax.envir].type,
			data: config.data,
			succFn: function(data){
				data.TotalPage = Math.ceil(data.TotalCount/data.PageSize) - 1;
				config.data.TotalPage = data.TotalPage;
				$("#result_totalcount").html(Util.fmtMoney(data.TotalCount, 0, true));
				$("#result-con").html(template('temp_list', data));
				$("#page_flip").html(template('temp_flip', data))
			}
		};
		Util.requestAjaxFn(ajaxParams);
	}
	getList();
	//点击收藏触发事件
	$("#result-con").on('click', '.collect', function(){
		var type = "";
		var $this = $(this);
		if($this.hasClass('selected')){
			//取消收藏
			type = "DELETE";
		}else{
			//收藏
			type = config_ajax[config_ajax.envir].type;
		}
		var ajaxParams = {
			url: config_ajax[config_ajax.envir].operFav,
			type: type,
			data: {
				Wid: $this.attr('data-id')
			},
			succFn: function(data){
				$this.toggleClass('selected');
			}
		};
		Util.requestAjaxFn(ajaxParams);
	})

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
	});
	//hover显示二维码图片
	$("#result-con").on('mouseenter','.icon-02',function(){
		$(this).parents(".accountnum").next(".webchat-codes").show();
	}).on('mouseleave','.icon-02',function(){
		$(this).parents(".accountnum").next(".webchat-codes").hide();
	})
})