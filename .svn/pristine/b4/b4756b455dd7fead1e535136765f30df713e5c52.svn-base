function expert() {
	$(() => {
		$('.promenu span').click(function () {
			$('.promenu span').css({
				'color': 'black'
			});
			$('#answerCount').css('color','black');
			$('.promenu span .menuline').hide();
			$(this).css({
				'color': '#27AE24'
			});
			$(this).children('#answerCount').css('color','#27AE24');
			$(this).children('.menuline').show();

			$('.project').hide();

			$('.project').eq($(this).index()).show();


		});

		$('.promenu span').eq(0).click();

		function introduce() {
			let flag = 1;//设置专家介绍显示状态，1：收起，2：展开
			let conLength = 100;
			let details = $('.introCon').html();
			let introCon = '';
			if (details.length > conLength) {
				$('.introCon').html(details.substring(0, conLength) + '...');
				$('.triangle').click(function () {
					if (flag == 1) {
						$('.introCon').html(details);
						$(this).css({
							'transform': 'rotate(180deg)'
						});
						flag = 2;
						return;
					}
					if (flag == 2) {
						flag = 1;
						$('.introCon').html(details.substring(0, conLength) + '...');
						$(this).css({
							'transform': 'rotate(0deg)'
						});
						return;
					}
				});
			}
			else
				$('.triangle').hide();
		}
		introduce();
	});
}
export default expert;