displayRandomCase()
function displayRandomCase(){
    fetch('./cases.json').then(data => data.json()).then(json => {
        const year_int= Math.floor(Math.random() * Object.keys(json).length);
        const year = Object.keys(json)[year_int];
        const docket = json[year][Math.floor(Math.random() * json[year].length)];
        const nextURL = window.location.pathname +"?term="+ year+"&docket="+docket;
        const nextTitle = 'Test';
        const nextState = { additionalInformation: 'Updated the URL with JS' };

        window.history.pushState(nextState, nextTitle, nextURL);

        window.history.replaceState(nextState, nextTitle, nextURL);
        updateCase()
    })


}
function updateCase() {
    var params = new URLSearchParams(window.location.search);
    var term = params.get("term")
    var docket = params.get("docket")
getCase(term,docket, data => displayCase(data))
function getCase(term,docket, callback) {
        fetch("./terms/"+ term + ".json")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                for (i in data){
                    if(data[i].docket_number == docket)
                        callback(data[i])
                }
                callback(null);
            })
            .catch(error => {
                console.error('Error reading JSON file:', error);
                callback(null);
            });
    }

// Example usage:

    function displayCase(json){
        var params = new URLSearchParams(window.location.search);
        url = "https:/www.oyez.org/cases/" + params.get("term") + "/"+ params.get("docket")
        document.getElementById("name").innerText = json.name
        document.title = json.name + "(" + json.citation.year + ")"
        document.getElementById("question").innerHTML = json.question;
        document.getElementById("name").setAttribute("href", url);
        document.getElementById("facts").innerHTML = json.facts_of_the_case
        document.getElementById("conclusion").innerHTML = json.conclusion
        document.getElementById("year").innerText = ' (' + json.citation.year + ')';
        var votes = json["decisions"][0]["votes"]
        let maj = "";
        let min = "";
        let none = "";
        for(let i in votes){
            console.log(votes[i].vote)

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
        console.log(maj)
        document.getElementById("majority").innerText = maj;
        document.getElementById("minority").innerText = min;
        document.getElementById("no-vote").innerText = none;

    }
}