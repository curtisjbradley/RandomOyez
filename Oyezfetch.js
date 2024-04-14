function getRandomCase(callback){
    fetch('./randomcase/cases.json').then(data => data.json()).then(json => {
        const year_int = Math.floor(Math.random() * Object.keys(json).length);
        const year = Object.keys(json)[year_int];
        const docket = json[year][Math.floor(Math.random() * json[year].length)];
        getCase(year,docket,cb=> {callback(cb)});
    })
}
function getCase(term,docket, callback) {
        fetch("./randomcase/terms/"+ term + ".json")
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


