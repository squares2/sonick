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
	
async function updateRequestState(requestid,newState) 
{
	const targetPath = "requests/"+requestid;
	const updates = 
	{
		state: newState
	};

	try 
	{
		await update(ref(db, targetPath), updates);
		console.log("State successfully updated in Realtime Database.");
	} 
	catch (error) 
	{
		console.error("Error updating state: ", error);
	}
}

function getNow()
{
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1; // Add 1 because months are 0-indexed
	const day = today.getDate();
	const hour = today.getHours();
	const minute = today.getMinutes();
	const second = today.getSeconds();
	//console.log(year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second);
	return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
}
function saveDriver(drivername,user,pass)
{
	localStorage.setItem('drivername',drivername);
	localStorage.setItem('username',user);
	localStorage.setItem('password',pass);
}
function loadRequests()
{
	localStorage.setItem('request',"");
	var empty=document.getElementById("empty-request");
	var request_section=document.getElementById("request_section");
	var found=false;
	const owner = localStorage.getItem('owner');
	if(owner!=null&&owner.length>0)
	{
		document.getElementById("owner").innerHTML=owner;
		document.getElementById("driver-login").style.display="none";
		document.getElementById("driver-logout").style.display="block";
		document.getElementById("searchship").style.display="block";
		var inner="";
		get(child(dbref,"ships")).then((snapshot) => 
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
					if(true)
					{
						inner+="<li><a href=\"\"id=\""+key+"\"class=\"categoryli\">طلبية رقم:"+key+"&nbsp;بإسم:"+item.deliverycustomername+"</a></li>";		
						found=true;
					}
					i++;
				}
				if(found)
				{
					loadCart(-1);
				}
				else
				{
				}
			} else {
				console.log("No data available");
			}
		}).catch((error) => 
		{
			console.error(error);
		});
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
			let inner1="<section><div class='tbl-header'><table><thead><tr><th>التاريخ</th><th>العنوان</th><th>رقم الزبون</th><th>الزبون</th><th>القيمة المرتجعة</th><th>القيمة $</th><th>القيمة ل.ل.</th><th>السائق/المتعهد</th><th>الشركة</th><th>رقم الطلبية</th></tr></thead></table></div><div class='tbl-content'><table><tbody>";
			let inner3="</tbody></table></div></section>";
			let inner2="";
			let date="21-12-2025";
			while (i < keys.length) 
			{
				const key = keys[i];
				const item = data[key];
				if(shipid==item.shipnumber||shipid==-1)
				{
					inner2+="<tr><td>"+date+"</td><td>"+item.deliverycustomeraddress+"</td><td>"+item.deliverycustomerphones+"</td><td>"+item.deliverycustomername
+"</td><td>"+0+"</td><td>"+item.pricedol+" $</td><td>"+item.
priceleb+" ل.ل.</td><td>"+item.
drivername+"</td><td>"+item.companyname+"</td><td>"+item.shipnumber
+"</td></tr>";
				}
				i++;
			}
			var page=document.getElementById("page");
			page.innerHTML=inner1+inner2+inner3;
		}
	});
}
function distribute(requestid)
{
	//document.getElementById("mycart").src ="png/cart3.png";
	var page=document.getElementById("page");
	if(page!=null)
	{
		get(child(dbref,"requests")).then((snapshot) => 
		{
			if (snapshot.exists()) 
			{
				const data = snapshot.val();
				const keys = Object.keys(data);
				let series="";
				let i = 0;

				while (i < keys.length) 
				{
					const key = keys[i];
					const item = data[key];
					if(requestid==key)
					{
						series=""+item.cart;
						localStorage.setItem('address',item.address);
						localStorage.setItem('state',item.state);
					}
					
					i++;
				}
				let data2=[];
				if(series!=null&&series.length>0)
				{
					let prod= series.split(";");
					for(i=0;i<prod.length-1;i++)
					{
						data2[i]=prod[i].split(":");
					}
					loadCart(data2);
				}
			} 
			else 
			{
				console.log("No data available");
			}
		}).catch((error) => 
		{
			console.error(error);
		});
	}
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
						localStorage.setItem('username',item.username);
						localStorage.setItem('owner',item.owner);
						document.getElementById("owner").innerHTML=item.owner;
						loadRequests();
						document.getElementById("page").innerHTML="";
						document.getElementById("searchship").style.display="block";
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
function setActiveCategory(clickedElement) 
{
    // We get the parent UL dynamically if the function is called this way
    const categoryList = document.getElementById('category');
    const currentlyActive = categoryList.querySelector('.active');

    if (currentlyActive) 
	{
        currentlyActive.classList.remove('active');
    }
    
    // Add the active class to the element that was actually clicked
    clickedElement.classList.add('active');
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
	const page= document.getElementById('page');
	const myform= document.getElementById('myForm');
	const categoryUL = document.getElementById('request_section');
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
	if(categoryUL!=null)
	{
		categoryUL.addEventListener('click', (event) => 
		{
			// Check if the clicked element (event.target) or one of its parents is a `.block`
			const clickedCategory = event.target.closest('a');

			if (clickedCategory) 
			{
				event.preventDefault(); 
				const requestid = clickedCategory.getAttribute('id');
				localStorage.setItem('request',requestid);
				distribute(requestid);
			}
		});
	}
	if(page!=null)
	{
		page.addEventListener('click', (event) => 
		{
			// Check if the clicked element (event.target) or one of its parents is a `.block`
			const clickedButton = event.target.closest('button');

			if (clickedButton) 
			{
				event.preventDefault(); 
				const button = clickedButton.getAttribute('id');
				if(button=="deliver1")
				{
					var deliver1=document.getElementById("deliver1").className;
					if(deliver1!="deliver12")
					{
						document.getElementById("deliver1").className = "deliver12";
						document.getElementById("deliver2").className = "deliver2";
						document.getElementById("deliver3").className = "deliver3";
						updateRequestState(localStorage.getItem('request'),"1");
					}
				}	
				else if(button=="deliver2")
				{
					var deliver2=document.getElementById("deliver2").className;
					if(deliver2!="deliver22")
					{
						document.getElementById("deliver1").className = "deliver1";
						document.getElementById("deliver2").className = "deliver22";
						document.getElementById("deliver3").className = "deliver3";
						updateRequestState(localStorage.getItem('request'),"0");
					}
				}	
				else if(button=="deliver3")
				{
					var deliver3=document.getElementById("deliver3").className;
					if(deliver3!="deliver32")
					{
						document.getElementById("deliver1").className = "deliver1";
						document.getElementById("deliver2").className = "deliver2";
						document.getElementById("deliver3").className = "deliver32";
						updateRequestState(localStorage.getItem('request'),"2");
					}
				}	
			}
		});
	}
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
document.addEventListener('DOMContentLoaded', (event) => 
{
    // Select the existing parent container (the <ul>)
    const categoryUL = document.getElementById('request_section');

    // Add a single click listener to the parent UL
    categoryUL.addEventListener('click', function(e) 
	{
        // e.target is the specific element that was clicked (could be the <a> or the <li> itself)
        
        // We need to find the nearest <li> parent of the element that was clicked
        // This handles cases where the user clicks directly on the link text (<a> tag)
        const clickedLI = e.target.closest('a');

        // Check if a valid LI was found and it is actually inside our UL
        if (clickedLI && categoryUL.contains(clickedLI)) 
		{
            // Prevent the default link behavior
            e.preventDefault(); 
            
            // Call our function using the found LI element
            setActiveCategory(clickedLI);
        }
    });
});
document.addEventListener('DOMContentLoaded',loadRequests);
