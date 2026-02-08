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
import {getDatabase, set, get,update,remove,ref,runTransaction,child,onValue,query,orderByChild,equalTo}
	from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
	const db=getDatabase();
	const dbref=ref(db);
	
	const shipRef = ref(db, "archives");
	onValue(shipRef, (snapshot) => 
	{
		if (snapshot.exists()) 
		{
			const data = snapshot.val();
			const keys = Object.keys(data);
			let i = 0;
			var searchship=document.getElementById("searchship");
			if(searchship!=null)searchship.value="";
			var searchphone=document.getElementById("searchphone");
			if(searchphone!=null)searchphone.value="";
			
			var pagenum=document.getElementById("pagenum");
			var pages=parseInt(keys.length/100);
			if(keys.length<=100)pages=1;
			else if(keys.length%100>0)pages++;
			localStorage.setItem('pages',pages);
			
			loadRequests();
		} 
		else 
		{
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
		var searchphone=document.getElementById("searchphone");
		if(searchphone!=null)searchphone.style.display="block";
		searchphone.value="1";
	}
}
function loadShip(shipnum)
{
	const db = getDatabase();
	const archivesRef = ref(db, "archives");
	const shipQuery = query(archivesRef, orderByChild("shipnumber"), equalTo(""+shipnum));
	get(shipQuery).then((snapshot) => 
	{
		if (snapshot.exists()) 
		{
			let i = 0;
			let inner1="<section><div class='tbl-header'><table><thead><tr><th>الحالة</th><th>التاريخ</th><th>القيمة المرتجعة</th><th>$ القيمة</th><th>L.L. القيمة </th><th>السائق/المتعهد</th><th>الشركة</th><th>رقم الطلبية</th></tr></thead></table></div><div class='tbl-content'><table><tbody>";
			let inner3="</tbody></table></div></section>";
			let inner2="";
			var driver="";
			var classname="";

			snapshot.forEach((childSnapshot) => 
			{
				const shipId = childSnapshot.key; // This is your shipid
				const item = childSnapshot.val(); // This is the ship data (shipnumber, date)
				
				if(item.state=="واصل")classname="style1";
				else if(item.state=="ملغى")classname="style2";
				else if(item.state=="مؤجل")classname="style3";
				else if(item.state=="ملغى لم يدفع ديلفري")classname="style4";
				else if(item.state=="ملغى تم دفع ديلفري")classname="style5";
				else classname="style0";

				if(item.drivername!="-")driver=item.drivername;
				else if(item.contractorname!="-")driver=item.contractorname;
				else driver="-";
				inner2+="<tr><td class='"+classname+"'>"+item.state+"</td><td>"+item.date+"</td><td>$ "+item.returnedvalue+"</td><td>$ "+item.pricedol+"</td><td>L.L. "+numberComma(item.
priceleb)+"</td><td>"+driver+"</td><td>"+item.companyname+"</td><td>"+item.shipnumber
+"</td></tr>";
			});
			var page=document.getElementById("page");
			page.innerHTML=inner1+inner2+inner3;
			var pagenum=document.getElementById("pagenum");
			pagenum.innerHTML="-/-";
		} 
		else 
		{
			console.log("No ship found with that number.");
		}
	}).catch((error) => 
	{
		console.error("Error searching for ship:", error);
	});
}
function loadPage()
{
	get(child(dbref,"archives")).then((snapshot) => 
	{
		if (snapshot.exists()) 
		{
			var pagepos=document.getElementById("searchphone");
			const data = snapshot.val();
			const keys = Object.keys(data);
			
			var pagenum=document.getElementById("pagenum");
			pagenum.innerHTML=pagepos.value+"/"+localStorage.getItem('pages');
			
			let inner1="<section><div class='tbl-header'><table><thead><tr><th>الحالة</th><th>التاريخ</th><th>القيمة المرتجعة</th><th>$ القيمة</th><th>L.L. القيمة </th><th>السائق/المتعهد</th><th>الشركة</th><th>رقم الطلبية</th></tr></thead></table></div><div class='tbl-content'><table><tbody>";
			let inner3="</tbody></table></div></section>";
			let inner2="";
			var driver="";
			var classname="";
			var min=0;
			var max=0;
			var currentpage=parseInt(pagepos.value);
			min=(currentpage-1)*100;
			max=currentpage*100;
			let i = min;
			while (i < keys.length) 
			{
				const key = keys[i];
				const item = data[key];
				if(i<max)
				{
					if(item.state=="واصل")classname="style1";
					else if(item.state=="ملغى")classname="style2";
					else if(item.state=="مؤجل")classname="style3";
					else if(item.state=="ملغى لم يدفع ديلفري")classname="style4";
					else if(item.state=="ملغى تم دفع ديلفري")classname="style5";
					else classname="style0";

					if(item.drivername!="-")driver=item.drivername;
					else if(item.contractorname!="-")driver=item.contractorname;
					else driver="-";
					inner2+="<tr><td class='"+classname+"'>"+item.state+"</td><td>"+item.date+"</td><td>$ "+item.returnedvalue+"</td><td>$ "+item.pricedol+"</td><td>L.L. "+numberComma(item.
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
					if(username.value.toLowerCase()==item.username.toLowerCase()&&password.value==item.password)
					{
						hideForm2();
						success=true;
						saveDriver(item.owner,item.username,item.password);
						document.getElementById("owner").innerHTML=item.owner;
						loadRequests();
						document.getElementById("page").innerHTML="";
						var searchship=document.getElementById("searchship");
						if(searchship!=null)searchship.style.display="block";
						var searchphone=document.getElementById("searchphone");
						if(searchphone!=null)searchphone.style.display="block";
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
        document.getElementById("searchphone").value="";
        const text = event.target.value;
        if(text.length>0)loadShip(parseInt(text));
    }
    else if (event.target && event.target.id === 'searchphone') 
	{
        document.getElementById("searchship").value="";
        const text = event.target.value;
        if(text.length>0)loadPage();
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
document.addEventListener('DOMContentLoaded',loadPage);

