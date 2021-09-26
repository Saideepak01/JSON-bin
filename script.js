//Top heading with search bar and button
const head = document.querySelector(".ttl");
head.innerHTML = `
    <div class="row-md">
        <div class="col title">
            <h2>JSON Bin {}</h2>
            <sup>storage solution for Web & Mobile apps</sup>
        </div>
        <div class="col">
            <form class="inputs">
                <label for="jsonSearch">Search for your JSON </label>
                <input type="text" class="form-control searchText" id="jsonSearch" placeholder="Enter your Unique ID">
                <button type="submit" class="btn btn-dark searchButton" onclick="readBin(event)">Search <i class="fas fa-search"></i></button>
            </form>
        </div>
        <div class="col textErr"></div>
    </div>
`;

//main intro screen below heading and search bar
function mainScrn(){
    const workingScreen = document.querySelector(".illustration");
    workingScreen.innerHTML = `
        <div class="row d-flex align-items-center">
            <div class="col-md m-1 d-grid gap-2 d-md-block">
                JSON.Stringify{<br/>
                    &emsp;<b>'Title':</b> 'Welcome user..! Glad to have you here',<br/>
                    &emsp;<b>'What is this ?':</b> 'It is a JSON Storage on the cloud for web and mobile apps',<br/>
                    &emsp;<b>'Feature1':</b> 'Zero database setup or maintenance',<br/>
                    &emsp;<b>'Feature2':</b> 'Data is private & secure so you can have total control',<br/>
		    &emsp;<b>'NOTE':</b> 'JSON data size limited to 500KB',<br/>
                }<br/><br/>
                <button type="submit" class=" btn btn-outline-dark start" onclick="jsonTextBox()"><span>Get Started</span></button>
            </div>
            <div class="col">
                <img class="jsonDump_illustraion" src = "json_illustration.png" alt="json_Dump_illustration">
            </div>
        </div>
    `;
}
mainScrn();

//on clicking Get Started, the json text box function runs and displays the textarea and other options to make a JSON upload to cloud.
function jsonTextBox() {
    const workingScreen = document.querySelector(".illustration");
    workingScreen.innerHTML = `
    <div class="box">
        <div class="row-sm m-1">
            <input type="text" class="form-control" id="filename" placeholder="Filename">
        </div>
        <div class="row contentBox m-1">
            <textarea class="form-control text" rows="15" onkeydown="insertTab(this, event);" placeholder="Type some JSON or drag & drop your JSON file here" spellcheck="false"></textarea>
        </div>
        <div class="row m-1">
            <div class="col-md d-flex justify-content-around">
                <div class="form-check form-switch me-3">
                    <input class="form-check-input" type="checkbox" id="switch" />
                    <label class="form-check-label" for="switch">Private bin</label>
                </div>
                <div class="d-grid gap-2 d-md-block">
                    <button class="btn btn-outline-dark beauty" onclick="makeOverJson()"><i class="fas fa-stream"></i> Pretify JSON</button>
                    <button type="submit" class="btn btn-dark" onclick="createJson()"><span>Create</span></button>
                </div>
            </div>
        </div>
    </div>
    `;
}

//on clicking Pretify JSON, the makeOverJson function runs and this makes live arrangement of JSON structure if it is messy
function makeOverJson() {
    try{
        const makePretty = document.querySelector(".text").value;
        const notInForm = JSON.parse(makePretty);
        const inForm = JSON.stringify(notInForm, null, 4);
        document.querySelector(".text").value = inForm;
        // console.log(makePretty);
    }catch(err){
        window.alert("Invalid JSON type");
    }
}

//on clicking Create button, the createJson function runs it parses and stringify it and the user also have the freedom to make the bin public or private, default is public, after that it sends the data to the API endpoint.
async function createJson(){
    try{
        const loads = document.querySelector(".loads");
        loads.innerHTML = `
            <div class="loader"></div>
        `;
        const validate = document.querySelector(".text").value;
        const parsing = JSON.parse(validate);
        const makingString = JSON.stringify(parsing, null, 4);
        const fileName = document.querySelector("#filename").value;
        const toggleCheck = document.querySelector("#switch").checked;
        const createData = await fetch(`https://api.jsonbin.io/v3/b`,{
            method: 'POST',
            body: makingString, 
            headers: {
                'content-Type': 'application/json',
                'X-Master-Key': '$2b$10$9BDNFrDMQRXkBmDNsC.V0uuYWKp4Uok3I5y4UJQvEJFNk.CHJLp6m',
                'X-Bin-Name':`${fileName}`,
                'X-Bin-Private': `${toggleCheck}`
            }
        });
        const convertedResponse = await createData.json();
        // console.log(convertedResponse);
        displayResponse([convertedResponse]);
    }catch(err){
        window.alert("error");
    }
}

//this functin runs after posting the JSON data to the cloud to indicate the successful upload of the file.
function displayResponse(convertedResponse){
    const responseBox = document.querySelector(".illustration");
    // globalThis.link = convertedResponse[0].metadata.id;
    responseBox.innerHTML = `
    <div class="box">
        <div class="row text-center">
            <div class="col-md m-1">
                <p><i class="fas fa-check-circle"></i><b> Upload successful!!🎉</b></p>
                <p><b>File name:</b> ${convertedResponse[0].metadata.name}</p>
                <p><b>Upload date:</b> ${new Date(convertedResponse[0].metadata.createdAt).toDateString()}</p>
                <p class="link"><b>Your URL</b><br/> <a href="https://api.jsonbin.io/v3/b/${convertedResponse[0].metadata.id}">https://api.jsonbin.io/v3/b/<br/>${convertedResponse[0].metadata.id}</a></p>
                <p><b>Your Unique ID: </b>${convertedResponse[0].metadata.id} <br/><b>Please a make a note of this ID for further use</b></p>
                <button type="submit" class="btn btn-success" onclick="mainScrn()">Ok</button><br/><br/>
                <sup><sup>*</sup>Note: The provided link can be viewed in browser only if the link is PUBLIC !</sup>
            </div>
        </div>
    </div>
    `;
}

//after uploading is over if the user wants to view the JSON file again the user can make a search this runs the readBin function and fetches the JSON and displays it.
async function readBin(event){
    event.preventDefault();
    let id;
    const search = document.querySelector(".searchText").value
    id = search;
    if(search === ""){
        window.alert("Enter a ID to search");
    }else{
        try{
            const readData = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`, {
                method: 'GET',
                private: true,
                headers: {
                    'X-Master-Key': '$2b$10$9BDNFrDMQRXkBmDNsC.V0uuYWKp4Uok3I5y4UJQvEJFNk.CHJLp6m',
                    'X-Bin-Meta': false
                }
            });
            const reading = await readData.json();
            // console.log(reading);
            str = JSON.stringify(reading, null, 4); 
            const displayContent = document.querySelector(".illustration");
                displayContent.innerHTML = `
                <div class="box">
                    <div class="row-sm m-1">
                        <div class="col-md">
                            <p>Your JSON content 😊</p>
                            <p><b>Your unique ID:</b> ${id}</p>
                            <textarea class="form-control p-1 contentUpdate" rows="15" readOnly>${str}</textarea>
                        </div>
                        <div class="col-md m-1 d-grid gap-2 d-md-block">
                            <button type="submit" class="btn btn-outline-dark test" onclick="edit()"><i class="fas fa-edit"></i> Edit</button>
                            <button type="submit" class="btn btn-success hide" onclick="submitModified()"><i class="fas fa-check-circle"></i> Submit</button>
                            <button type="submit" class="btn btn-outline-danger" onclick="deleteBin()"><i class="fas fa-trash-alt"></i> Delete</button>
                        </div>
                    </div>
                </div>
                `;
        }catch(err){
            console.log(err);
        }
    }
}

//edit function runs to show the submit button to the screen.
function edit(){
    window.alert("You can now edit your JSON file.");
    document.querySelector(".contentUpdate").readOnly = false;
    const displaybtn = document.querySelector(".hide");
    displaybtn.classList.remove("hide");
}

//if the user wants to make changes in the JSON file the user can edit the file and make a submit this makes a update in the API endpoint.
async function submitModified(){
    const search = document.querySelector(".searchText").value;
    let id;
    id = search;
    try{
        const newContent = document.querySelector(".contentUpdate").value;
        const parsing = JSON.parse(newContent);
        const makingString = JSON.stringify(parsing, null, 4); 
        const updateData = await fetch(`https://api.jsonbin.io/v3/b/${id}`,{
            method: 'PUT',
            body: makingString,
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2b$10$9BDNFrDMQRXkBmDNsC.V0uuYWKp4Uok3I5y4UJQvEJFNk.CHJLp6m',
            }
        });
        const updated = await updateData.json();
        document.querySelector(".contentUpdate").readOnly = true;
        // console.log(updated);
        if(updated.message === 'Bin not found'){
            window.alert("Bin not found");
        }else{
            window.alert("updated!!🎉");
        }
    }catch(err){
        console.log(err);
    }
    // console.log(id);
}

//if we want to delete the JSON file the user can click the delete button this runs the deleteBin function
async function deleteBin(){
    const search = document.querySelector(".searchText").value
    id = search;
    try{
        const deleteData = await fetch(`https://api.jsonbin.io/v3/b/${id}`, {
            method: 'DELETE',
            private: true,
            headers: {
                'X-Master-Key': '$2b$10$9BDNFrDMQRXkBmDNsC.V0uuYWKp4Uok3I5y4UJQvEJFNk.CHJLp6m'
            }
        });
        const deleted = deleteData.json();
        console.log(deleted);
        document.querySelector(".searchText").value = "";
        window.alert("Bin deleted successfully");
        mainScrn();
    }catch(err){
        window.alert("Invalid");
    }
    // mainscreen();
}

//footer information.
const footing = document.querySelector('.bottom');
footing.innerHTML = `
<p class="btm"><i class="fas fa-code footingbg"></i> with <i class="fas fa-heart footingbg"></i> by Sai Deepak</p>`;

//function for closing the alert information.
function closebtn(){
    const alert = document.querySelector(".notification");
    alert.classList.add("hide");
}

//to make tab spaces in the text area this insertTab function is used.
function insertTab(o, e)
{		
	var kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
	if (kC == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey)
	{
		var oS = o.scrollTop;
		if (o.setSelectionRange)
		{
			var sS = o.selectionStart;	
			var sE = o.selectionEnd;
			o.value = o.value.substring(0, sS) + "\t" + o.value.substr(sE);
			o.setSelectionRange(sS + 1, sS + 1);
			o.focus();
		}
		else if (o.createTextRange)
		{
			document.selection.createRange().text = "\t";
			e.returnValue = false;
		}
		o.scrollTop = oS;
		if (e.preventDefault)
		{
			e.preventDefault();
		}
		return false;
	}
	return true;
}
