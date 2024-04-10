displayRandomCase()
function displayRandomCase(){
    fetch('./urls.json').then(data => data.json()).then(json => {
        const year_int = Math.floor(Math.random() * Object.keys(json).length);
        console.log(year_int)

        var caseSplit = json[year_int].toString().split("/")
        const nextURL = window.location.pathname +"?term="+ caseSplit[1]+"&docket="+caseSplit[2];
        const nextTitle = 'Test';
        const nextState = { additionalInformation: 'Updated the URL with JS' };

        window.history.pushState(nextState, nextTitle, nextURL);

        window.history.replaceState(nextState, nextTitle, nextURL);
        displayCase()
    })


}
function displayCase() {
    var params = new URLSearchParams(window.location.search);
    url = "https:/api.oyez.org/cases/" + params.get("term") + "/"+ params.get("docket")

    fetch(url).then(res =>
        res.json()).then(json => {
            document.getElementById("name").innerText = json.name
        document.title = json.name + "(" + json.citation.year + ")"
        document.getElementById("question").innerHTML = json.question;
        document.getElementById("name").setAttribute("href", url);
        document.getElementById("facts").innerHTML = json.facts_of_the_case
        document.getElementById("conclusion").innerHTML = json.conclusion
        document.getElementById("year").innerText = ' (' + json.citation.year + ')';
        document.getElementById("decision").innerText = json.decisions[0].description
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
    });



}