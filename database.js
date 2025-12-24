import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

const firebaseConfig = 
{
  apiKey: "AIzaSyDZXyidFBKqyKLuQP-zrRP-YBZ0ncr_tNc",
  authDomain: "sonick-1e7a9.firebaseapp.com",
  databaseURL: "https://sonick-1e7a9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sonick-1e7a9",
  storageBucket: "sonick-1e7a9.firebasestorage.app",
  messagingSenderId: "273325585946",
  appId: "1:273325585946:web:c986cfe80220f4bdd5c3a3"
};

const app = initializeApp(firebaseConfig);	
import {getDatabase, set, get,update,remove,ref,runTransaction,child,onValue}
	from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
	const db=getDatabase();
	const dbref=ref(db);
	
	const shipRef = ref(db, "ships");
	onValue(shipRef, (snapshot) => 
	{
		if (snapshot.exists()) 
		{
			const data = snapshot.val();
			const keys = Object.keys(data);
			let i = 0;
			while (i < keys.length) 
			{
				const key = keys[i];
				const item = data[key];
				loadRequests();
				var searchship=document.getElementById("searchship");
				if(searchship!=null)searchship.value="";
				i++;
			}
		} else {
			console.log("No data available");
		}
	});

function saveDriver(owner,user,pass)
{
	localStorage.setItem('owner',owner);
	localStorage.setItem('username',user);
	localStorage.setItem('password',pass);
}
function loadRequests()
{
	const owner = localStorage.getItem('owner');
	if(owner!=null&&owner.length>0)
	{
		document.getElementById("owner").innerHTML=owner;
		document.getElementById("driver-login").style.display="none";
		document.getElementById("driver-logout").style.display="block";
		var searchship=document.getElementById("searchship");
		if(searchship!=null)searchship.style.display="block";
		loadCart(-1);
	}
}
function loadCart(shipid)
{
	get(child(dbref,"ships")).then((snapshot) => 
	{
		if (snapshot.exists()) 
		{
			const data = snapshot.val();
			const keys = Object.keys(data);
			let i = 0;
			let inner1="<section><div class='tbl-header'><table><thead><tr><th>الحالة</th><th>التاريخ</th><th>العنوان</th><th>رقم الزبون</th><th>الزبون</th><th>القيمة المرتجعة</th><th>$ القيمة</th><th>L.L. القيمة </th><th>السائق/المتعهد</th><th>الشركة</th><th>رقم الطلبية</th></tr></thead></table></div><div class='tbl-content'><table><tbody>";
			let inner3="</tbody></table></div></section>";
			let inner2="";
			var status="";
			var driver="";
			while (i < keys.length) 
			{
				const key = keys[i];
				const item = data[key];
				if(shipid==item.shipnumber||shipid==-1)
				{
					if(item.state==1)status="واصل";
					else if(item.state==2)status="ملغى";
					else if(item.state==3)status="مؤجل";
					else if(item.state==4)status="ملغى لم يدفع ديلفري";
					else if(item.state==5)status="ملغى تم دفع ديلفري";
					else status="-";
					if(item.drivername!="-")driver=item.drivername;
					else if(item.contractorname!="-")driver=item.contractorname;
					else driver="-";
					inner2+="<tr><td>"+status+"</td><td>"+item.date+"</td><td>"+item.deliverycustomeraddress+"</td><td>"+item.deliverycustomerphones+"</td><td>"+item.deliverycustomername
+"</td><td>"+item.returnedvalue+"</td><td>$ "+item.pricedol+"</td><td>L.L. "+numberComma(item.
priceleb)+"</td><td>"+driver+"</td><td>"+item.companyname+"</td><td>"+item.shipnumber
+"</td></tr>";
				}
				i++;
			}
			var page=document.getElementById("page");
			page.innerHTML=inner1+inner2+inner3;
		}
	});
}
function loginDriver()
{
	var username=document.getElementById("username");
	var password=document.getElementById("password");
	var success=false;
	if(username.value.length>0&&password.value.length>0)
	{
		get(child(dbref,"users")).then((snapshot) => 
		{
			if (snapshot.exists()) 
			{
				const data = snapshot.val();
				const keys = Object.keys(data);
				let i = 0;
				while (i < keys.length) 
				{
					const key = keys[i];
					const item = data[key];
					if(username.value==item.username&&password.value==item.password)
					{
						hideForm2();
						success=true;
						saveDriver(item.owner,item.username,item.password);
						document.getElementById("owner").innerHTML=item.owner;
						loadRequests();
						document.getElementById("page").innerHTML="";
						var searchship=document.getElementById("searchship");
						if(searchship!=null)searchship.style.display="block";
					}
					i++;
				}
				if(!success)
				{
					var message=document.getElementById("message-label2");
					message.style.display="block";
					window.setTimeout(function() 
					{
						if (message) 
						{
							message.classList.add('hidden');
						}
					}, 3000);
					message.style.display="block";
					message.classList.remove('hidden');
				}
			}
		});
	}
}
document.addEventListener('keyup', function(event) 
{
    if (event.target && event.target.id === 'searchship') 
	{
        
        const text = event.target.value;
        if(text.length>0)loadCart(parseInt(text));
		else loadCart(-1);
    }
});
document.addEventListener('DOMContentLoaded', () => 
{
	const myform= document.getElementById('myForm');
	const login_btn = document.getElementById('driver-login');
	const logout_btn = document.getElementById('driver-logout');
	const login_form = document.getElementById('login_form');
	myform.addEventListener("keyup", function(event) 
	{
        if (event.key === "Enter") 
		{
			loginDriver();
        }
    });
	login_form.addEventListener('click', (event) => 
	{
		loginDriver();
	});
	if(login_btn!=null)
	{
		login_btn.addEventListener('click', (event) => 
		{
			event.preventDefault(); 
			showForm2();
			login_btn.style.display="none";
		});
	}
	if(logout_btn!=null)
	{
		logout_btn.addEventListener('click', (event) => 
		{
			event.preventDefault(); 
			login_btn.style.display="block";
			logout_btn.style.display="none";
			localStorage.setItem('username',"");
			localStorage.setItem('owner',"");
			document.getElementById("owner").innerHTML="";
			document.getElementById("request_section").innerHTML="";
			document.getElementById("page").innerHTML="";
		});
	}
});
document.addEventListener('DOMContentLoaded',loadRequests);
