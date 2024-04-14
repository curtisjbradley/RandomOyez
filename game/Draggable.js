var locations = [document.getElementById("case1"),document.getElementById("case2"),document.getElementById("case3"),document.getElementById("case4"),document.getElementById("case5")];
for(e in locations){
    dragElement(locations[e])
}
let submitted = false;
var positions = [[200,200], [400,200], [600,200],[800,200],[1000,200]]
let cases = [null,null,null,null,null]
reorder(null)
const width = 150;
function dragElement(elmnt) {

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        header = document.getElementById(elmnt.id + "header");
        resize(header,75)
        resize(document.getElementById(elmnt.id+"text"),175);
        // if present, the header is where you move the DIV from:
        header.onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        e.target.parentNode.parentElement.appendChild(e.target.parentNode);
    }

    function elementDrag(e) {
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        if(pos3 < 0) return;
        var insertAt = -1;
        for(i = 0; i < positions.length; i++) {
            const dx = pos3 - positions[i][0] - (width / 2);
            if (dx < 0) {
                insertAt = i;
                break;
            }
        }
        if(pos3 > positions[4][0] + (width/2)) insertAt=5;
        const target =  document.getElementById(e.target.id.replace("header",""));

        let newLocs = []
        if(insertAt === -1){newLocs[0] = target}

        for(let i = 0; i < locations.length; i++) {
            if(insertAt === i){
                newLocs.push(target)
            }
            if(locations[i] === target){continue}
            if(locations[i] == null || locations[i].id.endsWith("text")){continue}
            newLocs.push(locations[i]);
        }
        if(insertAt > locations.length-1){newLocs.push(target)}
        locations = newLocs;
        reorder(target);




        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {

        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        reorder(null);

    }
}
function resize(element,desired){
    element.style.fontSize = "50px";
    while (element.clientHeight > desired) {
        const style = window.getComputedStyle(element, null).getPropertyValue('font-size');
        const size = parseFloat(style);
        if(size === 0) break;
        element.style.fontSize = size-1 + 'px'
    }

}
function reorder(exclude){
    let counter = -1;

    for (var i = 0; i < locations.length; i++) {
        if(locations[i] == null){continue;}
        counter++
        if(locations[i] === exclude) {
            continue;
        }
        locations[i].style.left = positions[counter][0] + "px";
        locations[i].style.top = positions[counter][1] + "px";
    }
}
function getOrder(){
    let order= []
    for(const i in locations) {
        order.push(parseInt(locations[i].id.replace("case","")));
    }
    return order;
}

function loadCase(json,number){
    let header = document.getElementById("case" + number + "header");
    let text = document.getElementById("case" + number + "text");
    text.innerHTML = json.question;
    header.innerHTML = json.name;
    resize(header,75);
    resize(text,175);
    cases[number -1] = json;
}

function displayData(caseNumber){
    showingInfo = true;
    for(el in locations){
        locations[el].hidden = true;
    }
    document.getElementById("submit").hidden=true;
    let data = document.getElementById("case-info");
    data.hidden=false;
    json = cases[caseNumber -1];
    document.getElementById("case-title").innerHTML = json.name;
    document.getElementById("case-facts").innerHTML = json.facts_of_the_case;
    document.getElementById("case-question").innerHTML= json.question;
    document.getElementById("case-ruling").innerHTML = json.conclusion;

}
function closeCaseData(){
    if(showingInfo && window.getComputedStyle(document.getElementById("case-info"),null).getPropertyValue("opacity") == 1) {
        let data = document.getElementById("case-info");
        if (!submitted)
            document.getElementById("submit").hidden = false;
        data.hidden = true;
        for (el in locations) {
            locations[el].hidden = false;
        }
        showingInfo = false;
    }

}
function submitToRuling(){
    submitted = true;
    document.getElementById("submit").hidden=true;
    for(el in locations){
        console.log(el)
        console.log(locations[el])
        let header = document.getElementById(locations[el].id + "header");
       header.onmousedown = null;
        header.style.cursor = "auto";
    }
    let years = [];
    for(data in cases){
        let year =cases[data].citation.year;
        if(year == null){
            year = cases[data].term;
        }
        years.push(year);
    }
    let sortedYears = [...years].sort();
    let order = [];
    for(let pos in locations){
        order.push(parseInt(locations[pos].id.replace("case","")));
    }
    for (let i = 0; i < 5; i++) {
        let year =cases[order[i] - 1].citation.year;
        if(year == null){
            year =cases[order[i] - 1].term;
        }
        years.push(year);
        if(!(year === sortedYears[i])){
            let correctOrder = [];
            for(let c = 0; c < 5; c++){
                for(let j = 0; j < correctOrder.length; j++){
                    if(years[correctOrder[j]] >= years[c]){
                        let insertAt = j;
                        let newOrder = [];
                        for(let a = 0; a < correctOrder.length; a++){
                            if(insertAt === a){
                                newOrder.push(c);
                            }
                            newOrder.push(correctOrder[a]);
                        }
                        if(newOrder.length === correctOrder.length){
                            newOrder.push(c);
                        }
                        correctOrder = newOrder
                        break;
                    }
                }
                if(correctOrder.length === c){
                    correctOrder.push(c);
                }
            }
            correctErrors(order,correctOrder,years);
            return;
        }
    }
    celebrate();
}
function celebrate(){

}
function correctErrors(order, correctOrder,years){
    console.log(years)
    console.log(correctOrder)

}
