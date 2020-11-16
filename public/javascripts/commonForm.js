window.onload = fadeIn; 

//fadein effect for show error message
function fadeIn() { 
	var fade = document.getElementById("errmsg"); 
	var opacity = 0; 
	var intervalID = setInterval(function() { 

		if (opacity < 1) { 
			opacity = opacity + 0.1 
			fade.style.opacity = opacity; 
		} else { 
			clearInterval(intervalID); 
		} 
	}, 200); 
} 

//only clear date of birth if only age entered on screen
function DOBClear()
{
	document.getElementById("dob").value = "";
}


//calculate age if date of birth entered
function ageUpdate()
{
	var dob= document.getElementById("dob").value ;
	
	if(!isNaN(Date.parse(dob)))
		document.getElementById("age").value =new Date().getFullYear() - new Date(dob).getFullYear();
	else
		document.getElementById("age").value ='';


}

//add medicine in prescription
function medAdd()
{
	var counter =mediSelected.length;
	var insertindex =0;
	var deletecount =0;
	var mediAdd = document.getElementById("medicineAdd").value;
	var mediQtyadd =document.getElementById("medicineQtyAdd").value;
	var mediUnitadd = document.getElementById("medicineAdd").options[document.getElementById("medicineAdd").selectedIndex].text;

	if(mediUnitadd.indexOf("[")){
		mediUnitaddarray=mediUnitadd.split("[");
		mediUnitadd=mediUnitaddarray[mediUnitaddarray.length-1];
		mediUnitadd=mediUnitadd.substring(0,mediUnitadd.length-1);
	}
	else	
		mediUnitadd="";

	var found = false;
	
	//in case original order is not right, go through whole list to find 
	for(i=0;i<counter;i++){
			insertindex =i;
			if(mediAdd==mediSelected[i].name){
				deletecount = 1;
				found=true;
				break;
			}
			
	}
	//not found, insert by ascending order of name
	if(!found){
		for(i=0;i<counter;i++){
				insertindex =i;

				if(mediAdd<mediSelected[i].name){
					found=true;
					break;
				}
				
		}		
	}
	
	//not found again, add element at the end
	if(!found)
		insertindex =counter;
	
	mediSelected.splice(insertindex,deletecount, {name:mediAdd,dose:mediQtyadd,unit:mediUnitadd});
	var stPrescription="";
	var stTable="";
	var i = 1;
	
	for(i=0;i<mediSelected.length;i++){
			stTable+="<div class='row'>";
			stTable+="<div class='col-md-3'>" +mediSelected[i].name +"</div><div class='col-md-3'>"+mediSelected[i].dose+"</div><div class='col-md-3'>"+mediSelected[i].unit+"</div><div class='col-md-3'><button onclick ='medRemove(\""+mediSelected[i].name+"\")'>"+label1+"</Button></div>";
			stTable+="</div>";
			
	}
	document.getElementById("prescription").value=  JSON.stringify(mediSelected);
	document.getElementById("mediTable").innerHTML = stTable;
	event.preventDefault();
}


//remove medicine in prescription
function medRemove(mediRemove)
{
	
	var found = false;
	var counter =mediSelected.length;
	var insertindex =0;
	var deletecount =0;
	
	for(i=0;i<counter;i++){
			insertindex =i;
			if(mediRemove==mediSelected[i].name){
				deletecount = 1;
				found=true;
				break;
			}

	}
	if(found)
		mediSelected.splice(insertindex,deletecount);
	
	var stTable=""
	var i = 1;

	
	for(i=0;i<mediSelected.length;i++){
			stTable+="<div class='row'>";
			stTable+="<div class='col-md-3'>" +mediSelected[i].name +"</div><div class='col-md-3'>"+mediSelected[i].dose+"</div><div class='col-md-3'>"+mediSelected[i].unit+"</div><div class='col-md-3'><button onclick ='medRemove(\""+mediSelected[i].name+"\")'>"+label1+"</Button></div>";
			stTable+="</div>";
	}
	if(mediSelected.length==0){
			stTable+="<div class='row'>";
			stTable+="<div class='col-md-12'>None</div>";
			stTable+="</div>";	
	}
	document.getElementById("prescription").value=  JSON.stringify(mediSelected);
	document.getElementById("mediTable").innerHTML = stTable;

	event.preventDefault();
}

//display prescription on screen from database
function medInit()
{
	var stPrescription="";
	var stTable="";
	var i = 1;
	
	
	for(i=0;i<mediSelected.length;i++){
			stTable+="<div class='row'>";
			stTable+="<div class='col-md-3'>" +mediSelected[i].name +"</div><div class='col-md-3'>"+mediSelected[i].dose+"</div><div class='col-md-3'>"+mediSelected[i].unit+"</div><div class='col-md-3'><button onclick ='medRemove(\""+mediSelected[i].name+"\")'>"+label1+"</Button></div>";
			stTable+="</div>";
			
	}
	document.getElementById("prescription").value=  JSON.stringify(mediSelected);
	document.getElementById("mediTable").innerHTML = stTable;
}

