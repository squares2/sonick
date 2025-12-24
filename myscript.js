function showForm2()
{
	document.getElementById("myForm").style.display="block";
	document.getElementById("username").value=localStorage.getItem('username');
	document.getElementById("password").value=localStorage.getItem('password');
	if(checkForm2())document.getElementById("login_form").className="btn";
	else document.getElementById("login_form").className="btn2";
}
function hideForm2()
{
	document.getElementById("myForm").style.display="none";
	document.getElementById("driver-login").style.display="block";
}
function checkForm2()
{
	var username=document.getElementById("username");
	var password=document.getElementById("password");
	if(username.value.length>0&&password.value.length>0)
	{
		document.getElementById("login_form").className="btn";
		return true;
	}
	else
	{
		document.getElementById("login_form").className="btn2";
		return false;
	}	
}
