(function(){
	
})();

function erwei(){
	var erweiImgId=document.getElementById('erweiImg')
	var firstImg=document.getElementById('firstImg')
	firstImg.className='closeImg'
	erweiImgId.className='erweiImg'
}
function closeImg(){
	var erweiImgId=document.getElementById('erweiImg')
	erweiImgId.className='closeImg'
	var firstImg=document.getElementById('firstImg')
	
	firstImg.className='showImg'
}
function show(){
	alert('正在研发中，敬请期待')
}

