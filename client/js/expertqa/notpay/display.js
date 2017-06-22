((display) => {
	//设置学员问题显示状态，1：收起，2：展开
	let flag = 1;
	let conLength = 60;
	let detail = content;
	if (detail.length > conLength) {
		$('#cmain').html(detail.substring(0, conLength) + '...');
		$('.arrow-down').click(function () {
			if (flag == 1) {
				$('#cmain').html(detail);
				$(this).css({
					'transform': 'rotate(180deg)'
				});
				flag = 2;
				return;
			}
			if (flag == 2) {
				flag = 1;
				$('#cmain').html(detail.substring(0, conLength) + '...');
				$(this).css({
					'transform': 'rotate(0deg)'
				});
				return;
			}
		});
	} else {
		$("#seat").hide();
	}
})();
