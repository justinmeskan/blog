$(function(){
	var name 		= $('#capname').text();
	if(name){
		name 		= name.split('');
		var cap 	= name[0].toUpperCase();
		var rest 	= name.slice(1);
		var anser 	= cap + rest;
		$('#capname').text(anser.split(',').join(''));
	}
});

$(function(){
	var name 		= $('#blogcap').text();
	if(name){
		name 		= name.split('');
		var cap 	= name[0].toUpperCase();
		var rest 	= name.slice(1);
		var anser 	= cap + rest;
		$('#blogcap').text("Welcome "+ anser.split(',').join(''));
	}
});

$(function(){
	function mailflag(id){
		var sn 		= $('#secretnumber').text()
		if(sn > 0){
			$(id).text("NewMail")
			$(id).css({'color':'red','font-size':'+=10'}).on('mouseover',function(){
				$(id).css({'color':'gold'})
			}).on('mouseout',function(){
					$(id).css({'color':'red'})
			});
		};
	}
	mailflag('#gotmail')
	mailflag('#gotmail2')
	mailflag('#gotmail3')
	mailflag('#gotmail5')
	mailflag('#gotmail6')
	mailflag('#gotmailprof')
});

function submit(id){
	$('#'+id).trigger('click');
};

function removepost(id){
	$('#'+id).trigger('click');
};

function mailbox(){
	$('#mail').trigger('click');
};

function checkmailbox(){
	$('#checkmailbox').trigger('click');
};

function clearmessages(){
	$('#button').trigger('click');
};

function avatar(){
	$('#avatarpost').trigger('click');
};

function changepost(){
	$('#changepost').trigger('click');
};

function sendmail(){
	$('#sendmail').trigger('click');
};

$(document).ready(function(){
	var dropBox;
	var hiddenfile 			= document.getElementById("hiddenavatar");
	window.onload = function(){
		dropBox 			= document.getElementById("dropBox");
		dropBox.ondragenter = ignoreDrag;
		dropBox.ondragover  = ignoreDrag;
		dropBox.ondrop 		= drop;
	};

	function ignoreDrag(e){
		e.stopPropagation();
		e.preventDefault();
	};

	function drop(e){
		e.stopPropagation();
		e.preventDefault();
		var data  = e.dataTransfer;
		var files = data.files;
		processFiles(files);
	};

	function processFiles(files){
		var file   			 = files[0];
		var reader 			 = new FileReader();
		reader.onload = function(e){
			hiddenfile.value = e.target.result;
		};
		reader.readAsDataURL(file);
	}
});


$(document).ready(function(){
	var userPostTemplate = Handlebars.compile($('#userPostTemplate').html());
	var blogpost = $('#blogpost');
	$('#blogform').on('submit',function(e){
		e.preventDefault();
		var dat = $('#blogform').serialize();
		$.post('/data/user-post',dat,function(data){
			blogpost.html(userPostTemplate(data))
			$('#postinputbox').val("")
		})	
	});
})



















