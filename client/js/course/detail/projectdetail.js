(function(){
	$(function(){
		if(parseInt($('.see').html())>0) {
			$('.see').css('color','#27AE24')
		}
		if(parseInt($('.agree').html())>0) {
			$('.agree').css('color','red')
		}
		
		$('.promenu span').click(function() {
			$('.promenu span').css({
				'color':'black'
			});
			$('.promenu span .menuline').hide();
			$(this).css({
				'color':'#27AE24'
			});
			$(this).children('.menuline').show();
			$('.project').hide();
			$('.project').eq($(this).index()).show();			
		});
		
		$('.promenu span').eq(0).click();
	});
})();
