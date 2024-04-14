const params = new URLSearchParams(window.location.search);
const term = params.get("term");
const docket = params.get("docket");

if(term != null && docket!= null){
    getCase(term,docket, data =>{if(data == null) {displayRandomCase()} else {updateCase()}});
} else {
    displayRandomCase()
}

populateTerms()
window.addEventListener("resize", function(event){
    document.getElementById("case-data").style.marginTop = document.getElementById("header").offsetHeight + 50+ "px";
})
window.addEventListener('popstate', function(event) {
       updateCase()
    });
function displayRandomCase(){
    fetch('./cases.json').then(data => data.json()).then(json => {
        const year_int= Math.floor(Math.random() * Object.keys(json).length);
        const year = Object.keys(json)[year_int];
        const docket = json[year][Math.floor(Math.random() * json[year].length)];
       goToCase(year,docket)
    })


}
function goToCase(t,d){
    const nextURL = window.location.pathname +"?term="+ t+"&docket="+d;
    const nextTitle = 'Test';
    const nextState = { additionalInformation: 'Updated the URL with JS' };

    window.history.pushState(nextState, nextTitle, nextURL);

    window.history.replaceState(nextState, nextTitle, nextURL);
    updateCase()
}
function updateCase() {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("term");
    const docket = params.get("docket");
    getCase(term, docket, data => displayCase(data))
}
function getCase(term,docket, callback) {
        fetch("./terms/"+ term + ".json")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                for (let i in data){
                    if(data[i].docket_number === docket) {
                        callback(data[i])
                        return data[i];
                    }
                }
                callback(null);
                return null;
            })
            .catch(error => {
                console.error('Error reading JSON file:', error);
                callback(null);
            });
    }

// Example usage:

    function displayCase(json){
        const params = new URLSearchParams(window.location.search);
        let url = "https://www.oyez.org/cases/" + params.get("term") + "/" + params.get("docket")
        document.getElementById("name").innerText = json.name
        document.title = json.name + " (" + json.citation.year + ")"
        document.getElementById("question").innerHTML = json.question;
        document.getElementById("name").setAttribute("href", url);
        document.getElementById("facts").innerHTML = json.facts_of_the_case
        document.getElementById("conclusion").innerHTML = json.conclusion
        document.getElementById("year").innerText = ' (' + json.citation.year + ')';
        const votes = json["decisions"][0]["votes"];
        let maj = "";
        let min = "";
        let none = "";
        for(let i in votes){

            switch (votes[i].vote){
                case "majority":
                    maj += votes[i].member.name + ", "
                    break;
                case "minority":
                    min += votes[i].member.name + ", "
                    break
                case "none":
                    none += votes[i].member.name + ", "

            }

        }
        document.getElementById("majority").innerText = maj;
        document.getElementById("minority").innerText = min;
        document.getElementById("no-vote").innerText = none;
        document.getElementById("case-data").style.marginTop = document.getElementById("header").offsetHeight + "px";


    }

    function pullCase(){
        goToCase(document.getElementById("term-list").value, document.getElementById("docket-list").value)


    }
    function populateTerms(){
        fetch('./cases.json').then(data => data.json()).then(json =>{
            var termlist = document.getElementById("term-list");

            for(let i in json){
                var option = document.createElement("option");
                option.value = i;
                option.innerText = i;
                termlist.appendChild(option);
            }
        })

    }
    function populateDockets(){
        fetch('./cases.json').then(data => data.json()).then(json => json[document.getElementById("term-list").value]).then(json =>{
            var docketlist = document.getElementById("docket-list");
            docketlist.innerHTML = '';
            document.getElementById("explore-case").disabled=true
            const dockets = json.sort((a, b) => {
                if (a.length !== b.length) {
                    return a.length - b.length;
                }
                return a.localeCompare(b);
            })
            console.log(dockets)
            for(let i in dockets){
                let option = document.createElement("option");
                docketlist.disabled = false;
                option.value = dockets[i];
                option.innerText = dockets[i];
                docketlist.appendChild(option);
            }
        })

    }

