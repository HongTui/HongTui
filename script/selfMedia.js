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
	var $category = $("#search_category,#search_category_nore");
	var $priceItem = $("#PriceItem");
	var $priceItem_type = $("#PriceItem_type");
	var $funs = $('#FunsItem');
	var $readItem_type = $("#readItem_type");
	var $readItem = $("#readItem");

	function getList(){
		var $price = $priceItem.find('.item.current');
		var _price_min = 0, _price_max = 0;
		if($price.length == 0){
			var $input = $priceItem.closest('.hongtui-box').find('[data-type=number]');
			_price_min = $input.eq(0).val();
			_price_max = $input.eq(1).val();
		}else{
			_price_min = $price.attr('data-min');
			_price_max = $price.attr('data-max');
		}

		var $fun = $funs.find('.item.current');
		var _fun_min = 0, _fun_max = 0;
		if($fun.length == 0){
			var $input = $funs.closest('.hongtui-box').find('[data-type=number]');
			_fun_min = $input.eq(0).val() * 10000;
			_fun_max = $input.eq(1).val() * 10000;
		}else{
			_fun_min = $fun.attr('data-min');
			_fun_max = $fun.attr('data-max');
		}


		var dataParams = {
			Category: $category.find('.current').html(),
			PriceItem: $priceItem_type.attr('data-type'),
			PriceMin: _price_min,
			PriceMax: _price_max,
			FollowMin: _fun_min,
			FollowMax: _fun_max,
			ReadItem: $readItem_type.attr('data-type'),
			ReadMin: $readItem.find("input:eq(0)").val() * 10000,
			ReadMax: $readItem.find("input:eq(1)").val() * 10000,
			SortItem: $('[data-type=sort] .select').attr('data-sortItem'),
			SortType: $('[data-type=sort] .select').attr('data-sortType')
		};
		var ajaxParams = {
			url: config_ajax[config_ajax.envir].getMedia,
			type: 'GET',
			data: $.extend(config.data, dataParams),
			succFn: function(data){
				data.TotalPage = Math.ceil(data.TotalCount/data.PageSize) - 1;
				config.data.TotalPage = data.TotalPage;
				$("#result_totalcount").html(Util.fmtMoney(data.TotalCount, 0, true));
				$("#result-con").html(template('temp_list', data));
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

	//绑定切换查询类型的点击事件
	$(".find-items .item").on('click', function(){
		if($(this).hasClass('current')) return;

		$(this).siblings().removeClass('current');
		$(this).parents(".find-items").siblings(".find-items").find(".item").removeClass('current');
		$(this).addClass('current');
		//清空输入框的内容
		$(this).closest('.hongtui-box').find('[data-type=number]').val('');
		//重置查询页码
		config.data.Page = 0;
		getList();
	});

	//绑定选择类型下拉框
	$(".find-items .select-box .select-item").on('click', function(){
		var $select = $(this).closest('.select-box');
		$select.find('.select').attr('data-type', $(this).attr('data-type')).html($(this).html());
		$(this).closest('.select-items').hide();

		//重置查询页码
		config.data.Page = 0;
		getList();
	});
	//绑定排序
	$('[data-type=sort]').on('mouseenter', function(){
		$(this).find('.select-items').show();
	}).on('mouseleave', function(){
		$(this).find('.select-items').hide();
	});
	$('[data-type=sort] .select-item').on('click', function(){
		var $this = $(this);
		var $select = $this.closest('.select-box').find('.select');
		$select.html($this.html()).attr({
			"data-sortItem": $this.attr('data-sortItem'),
			"data-sortType": $this.attr('data-sortType')
		});
		$this.closest('.select-items').hide();
		
		//重置查询页码
		config.data.Page = 0;
		getList();
	});
	$(".find-items .select-box").on('mouseenter', function(){
		$(this).find('.select-items').show();
	}).on('mouseleave', function(){
		$(this).find('.select-items').hide();
	});
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
	//点击报价触发事件
	$("#result-con").on('click', '.price', function(){
		var type = "";
		var $this = $(this);
		if($this.hasClass('selected')){
			//取消报价
			type = "DELETE";
		}else{
			//添加报价
			type = config_ajax[config_ajax.envir].type;
		}
		var ajaxParams = {
			url: config_ajax[config_ajax.envir].cart,
			type: type,
			data: {
				Wid: $this.attr('data-id')
			},
			succFn: function(data){
				$this.toggleClass('selected');
			}
		};
		Util.requestAjaxFn(ajaxParams);
	});
	//控制数字框不能输入其他字符
	$('[data-type="number"]').on('change', function(){
		var reg = /^\d+$/;
		var value = $(this).val();
		$(this).val($(this).val().replace(/[^\d]/g, ''));
	});
	//点击输入框边的确定按钮时触发
	$('.range-certain').on('click', function(){
		var _type = $(this).attr('data-type');
		$(this).closest('.hongtui-box').find('.find-items .item.current').removeClass('current');

		//重置查询页码
		config.data.Page = 0;
		getList();
	})
	//hover显示二维码图片
	$("#result-con").on('mouseenter','.icon-02',function(){
		$(this).parents(".accountnum").next(".webchat-codes").show();
	}).on('mouseleave','.icon-02',function(){
		$(this).parents(".accountnum").next(".webchat-codes").hide();
	})
	//常见分类 更多点击事件
	$(".hongtui-box.find").on('click','.find-more',function(){
		$(".find-items.more-other").slideToggle();
		if($(".hongtui-box.find .find-more").html() == '更多<span class="find-arrow"></span>'){
			$(".hongtui-box.find .find-more").html('收起<span class="find-arrow"></span>')
		}else{
			$(".hongtui-box.find .find-more").html('更多<span class="find-arrow"></span>')
		}
	})
});








