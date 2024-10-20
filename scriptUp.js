////////////////////////////////////////////classes//////////////////////////////////////////////////////////////////

class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

class Element {
    constructor(Ni, Nf, Material, Ar) {
        this.xi = Ni.x;
        this.yi = Ni.y;
        this.xj = Nf.x;
        this.yj = Nf.y;

        this.Ni = Ni;
        this.Nf = Nf;

        this.Material = Material;

        this.El = Material.El;

        this.Ar = Ar;
        let length = Math.sqrt(Math.pow((this.xj - this.xi), 2) + Math.pow((this.yj - this.yi),2));
        let l = (this.xj - this.xi) / length;
        let m = (this.yj - this.yi) / length;
        
        this.a = l * l * Ar * this.El / length
        this.b = l * m * Ar * this.El / length;
        this.c = m * m * Ar * this.El / length;
    }
  }

class Fixture {
    constructor(Node, Angle, Type) {
        this.Node = Node;
        this.Angle = Angle;
        this.Type = Type;
    }
}

class Force {
    constructor(Node, Angle, Value) {  
        this.Type = "force";
        this.Node = Node;
        this.Angle = Angle;
        this.Value = Value;
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////// Initial States ////////////////////////////////////////////////////////////

let materials = [
    { id: "Steel", El: 30e3},
    { id: "Aluminium", El: 11e3 }
  ];

let nodes = [
    new Node(120, 0),
    new Node(120, 60),
    new Node( 0 , 0),
    new Node( 0 , 100),
];

let elements = [
    new Element(nodes[0],nodes[1], materials[0], 0.1963), // 1 - 2
    new Element(nodes[0],nodes[2], materials[1], 0.1257), // 1 - 3
    new Element(nodes[1],nodes[2], materials[0], 0.1963), // 2 - 3
    new Element(nodes[1],nodes[3], materials[1], 0.1257), // 2 - 4
    new Element(nodes[2],nodes[3], materials[0], 0.1963), // 3 - 4
];

let components = [
    new Force(nodes[0], 240, 2000),
    new Fixture(nodes[2], 0, 'roller'),
    new Fixture(nodes[3], 0, 'fixed'),
]

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////// Initialize GUI ////////////////////////////////////////////////////////////
function initializeGUI() {

    // colours for the nodes 
    const colours = ['red', 'green', 'yellow', 'orange']

    // Clear previous nodes and elements
    document.getElementById("node-circles").innerHTML = '';
    document.getElementById("element-lines").innerHTML = '';
    document.getElementById("component-paths").innerHTML = '';
    
    document.getElementById('node-values-table').innerHTML = '';
    document.getElementById('element-values-table').innerHTML = '';
    document.getElementById('component-values-table').innerHTML = '';
    
    // add the nodes to the svg
    nodes.forEach((node, index) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('id', `node${index + 1}circle`)
        circle.setAttribute('class', 'nodeSvg')
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", 100-node.y);
        circle.setAttribute("r", 4.375);
        circle.setAttribute("fill", colours[index]);
        circle.setAttribute("stroke", "black");
        document.getElementById("node-circles").appendChild(circle);

        circle.addEventListener('click', function () {
            selectNode(index, circle);
        });

        circle.addEventListener('mousedown', (event) => {
                selectNode(index, circle);
                // When mouse is pressed on a node
                selectedNode = index;
                offsetX = (event.clientX - circle.getAttribute('cx'));
                offsetY = (event.clientY - circle.getAttribute('cy'));
                document.addEventListener('mousemove', dragNode);
                document.addEventListener('mouseup', stopDragging);
        });

    });

    // add the elements to the svg
    elements.forEach((element, index) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", element.xi);
        line.setAttribute("y1", 100-element.yi);
        line.setAttribute("x2", element.xj);
        line.setAttribute("y2", 100-element.yj);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-linecap", "round");
        line.setAttribute("stroke-width", "0.2rem");
        document.getElementById("element-lines").appendChild(line);
    });

    // add components to the svg
    components.forEach((component, index) => {
        if(component.Type === 'force') {
            const force = document.createElementNS("http://www.w3.org/2000/svg", "path");
            force.setAttribute("d", `m ${component.Node.x + 7} ${100-component.Node.y} l 25 0 m 0 0 l -5 4 m 5 -4 l -5 -4`);
            force.setAttribute("fill", "none");
            force.setAttribute("stroke", "red");
            force.setAttribute("stroke-width", "2px");
            force.setAttribute("stroke-linecap", "round");
            force.style.transform = `rotate(-${component.Angle}deg)`;
            force.style.transformOrigin = `${(component.Node.x)/2}% ${(100-component.Node.y)/1.5}%`;
            document.getElementById("component-paths").appendChild(force);
        } else if(component.Type === 'roller') {
            const support = document.createElementNS("http://www.w3.org/2000/svg", "path");
            support.setAttribute("d", `m ${component.Node.x} ${100-component.Node.y} l -8 8 m 8 -8 l -8 -8 m 0 -2 l 0 20 m 0 -2.5 a 1 1 0 0 0 -5 0 a 1 1 0 0 0 5 0 m 0 -5 a 1 1 0 0 0 -5 0 a 1 1 0 0 0 5 0 m 0 -5 a 1 1 0 0 0 -5 0 a 1 1 0 0 0 5 0 m 0 -5 a 1 1 0 0 0 -5 0 a 1 1 0 0 0 5 0`);
            support.setAttribute("fill", "none");
            support.setAttribute("stroke", "black");
            support.setAttribute("stroke-width", "2px");
            support.setAttribute("stroke-linecap", "round");
            support.style.transform = `rotate(-${component.Angle}deg)`;
            support.style.transformOrigin = `${(component.Node.x)/2}% ${(100-component.Node.y)/1.5}%`;
            document.getElementById("component-paths").appendChild(support);
        } else if(component.Type === 'fixed') {
            const support = document.createElementNS("http://www.w3.org/2000/svg", "path");
            support.setAttribute("d", `m ${component.Node.x} ${100-component.Node.y} l -8 8 m 8 -8 l -8 -8 m 0 -2 l 0 20 m 0 -1 l -3 -3 m 3 3 m 0 -5 l -3 -3 m 3 3 m 0 -5 l -3 -3 m 3 3 m 0 -5 l -3 -3 m 3 3`);
            support.setAttribute("fill", "none");
            support.setAttribute("stroke", "black");
            support.setAttribute("stroke-width", "2px");
            support.setAttribute("stroke-linecap", "round");
            support.style.transform = `rotate(-${component.Angle}deg)`;
            support.style.transformOrigin = `${(component.Node.x)/2}% ${(100-component.Node.y)/1.5}%`;
            document.getElementById("component-paths").appendChild(support);
        }

    });

    // add the nodes to the table
    nodes.forEach((node, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="node-table-icon">Node ${index+1}</td>
                        <td><input type="number" value="${node.x}" id="x${index+1}"></td>
                        <td><input type="number" value="${node.y}" id="y${index+1}"></td>`;
        document.getElementById('node-values-table').appendChild(row);
    });

    // add the elements to the table
    elements.forEach((element, index) => { // add min an max values so you cant choose nodes that dont exist
        const rowgap = document.createElement('tr') ;
        rowgap.className = 'row-gap';
        document.getElementById('element-values-table').appendChild(rowgap);
        
        const row = document.createElement('tr');

        let materialSelection = ``
        let matIndex = 0;
        materials.forEach((mat) => {
            if(element.Material.id === mat.id){
                materialSelection += `<option value="${matIndex}" selected>${mat.id}</option>`;
                matIndex++;
            }else{
                materialSelection += `<option value="${matIndex}">${mat.id}</option>`;
                matIndex++;
            }
        });

        row.innerHTML = `<td class="ele">Bar ${index+1}</td>
                        <td class="node-connectivity-td"><input type="number" class="n${nodes.findIndex(obj => obj === element.Ni) + 1} node-connectivity-node-icon" id="E${index+1}Ni" value="${nodes.findIndex(obj => obj === element.Ni) + 1}"></input> <b>=></b> <input type="number" class="n${nodes.findIndex(obj => obj === element.Nf) + 1} node-connectivity-node-icon" id="E${index+1}Nf" value="${nodes.findIndex(obj => obj === element.Nf) + 1}"></input></td>
                        <td><input type="number" value="${element.Ar}" id="E${index+1}A" step=".01" class="Cross-Section-input"></td>
                        <td><select id="material-dropdown-${index+1}" class='material-dropdown' name="dropdown">
                        ${materialSelection}
                        </select></td>`;
        document.getElementById('element-values-table').appendChild(row);
    });

    // add the components to the table
    components.forEach((component, index) => {
        const row = document.createElement('tr');
        let forceIndex = 0;
        let fixtureIndex = 0;
        let rollerIndex = 0;

        if(component.Type === 'force') {
            row.innerHTML = `<td class="component">Force</td>
                            <td  class="center-text"><input class="comp-node" id='force${forceIndex+1}N' value='${nodes.findIndex(obj => obj === component.Node) + 1}'></input></td>
                            <td><input class="angle-input" type="number" min="0" max="360" value="${component.Angle}" id="ForceAngle${forceIndex+1}" ></td>
                            <td><input type="number" value="${component.Value}" id="ForceValue${forceIndex+1}"></td>`;
            forceIndex++;
        } else if(component.Type === 'roller') {
            row.innerHTML = `<td class="component">Roller support</td>
                            <td class="center-text"><input class="comp-node" id='roller${rollerIndex+1}N' value='${nodes.findIndex(obj => obj === component.Node) + 1}'></input></td>
                            <td><input class="angle-input" type="number" min="0" max="45" value="${component.Angle}" id="RollerAngle${rollerIndex+1}"></td>
                            <td></td>`;
            rollerIndex++;
        } else if(component.Type === 'fixed') {
            row.innerHTML = `<td class="component">Fixed support</td>
                            <td class="center-text"><input class="comp-node" id='fixture${fixtureIndex+1}N' value='${nodes.findIndex(obj => obj === component.Node) + 1}'></input></td>
                            <td><span class="FixedSupportAngle">${component.Angle}</span></td>
                            <td></td>`;
            fixtureIndex++;
        }
        document.getElementById('component-values-table').appendChild(row);

        });

        //upate the elements, components, nodes, and materials arrays whenever an input changes
document.querySelectorAll('input').forEach((inputElement) => {
    inputElement.addEventListener('change', () => {
      updateNodes();
      updateElements();
      updateComponents()
      initializeGUI();
    });
  });
document.querySelectorAll('select').forEach((selectElement) => {
    selectElement.addEventListener('change', () => {
        updateNodes();
        updateElements();
        updateComponents()
        initializeGUI();
    });
});


}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////// add Node & Element Logic ////////////////////////////////////////////////////////////

/// Fix the UI before figuring out how you want to do this//
// function addNode() { // Ai WROTE THIS FUNCTION, USER BE WARE 
//     let x = parseFloat(document.getElementById('newNodeX').value);
//     let y = parseFloat(document.getElementById('newNodeY').value);
//     nodes.push({x, y});
//     initializeGUI();
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////// Update nodes, elements, and containers Array /////////////////////////////////////////

function updateNodes() {
    
    nodes = nodes.map((node, index) => ({
        x: parseFloat(document.getElementById(`x${index+1}`).value),
        y: parseFloat(document.getElementById(`y${index+1}`).value)
    }));

}

function updateElements() {

    let numOfElements = document.querySelectorAll('.node-connectivity-td');

    for(let i = 0; i < numOfElements.length; i++) {
    elements[i] = new Element(nodes[parseFloat(document.getElementById(`E${i+1}Ni`).value)-1], 
                              nodes[parseFloat(document.getElementById(`E${i+1}Nf`).value)-1],
                              materials[document.getElementById(`material-dropdown-${i+1}`).value],
                              parseFloat(document.getElementById(`E${i+1}A`).value))
    }

}

function updateComponents() {
    let ComponentsNodeList = document.querySelectorAll('.component');

    let forceIndex = 0;
    let fixtureIndex = 0;
    let rollerIndex = 0;

    ComponentsNodeList.forEach((comp, index) => {
        
        if(ComponentsNodeList[index].textContent === 'Force') {
            console.log(ComponentsNodeList[index].textContent)
            components[index] = new Force(nodes[parseFloat(document.getElementById(`force${forceIndex+1}N`).value)-1],
                                                parseFloat(document.getElementById(`ForceAngle${forceIndex+1}`).value),
                                                parseFloat(document.getElementById(`ForceValue${forceIndex+1}`).value))
            forceIndex++;
        } else if( ComponentsNodeList[index].textContent === 'Roller support') {
            components[index] = new Fixture(nodes[parseFloat(document.getElementById(`roller${rollerIndex+1}N`).value)-1],
                                            parseFloat(document.getElementById(`RollerAngle${rollerIndex+1}`).value),
                                            'roller')
            rollerIndex++;
        } else {
            components[index] = new Fixture(nodes[parseFloat(document.getElementById(`fixture${fixtureIndex+1}N`).value)-1],
                                            0,
                                            'fixed')
            fixtureIndex++;
        }

        });

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////// move the nodes around with mouse /////////////////////////////////////////

let selectedNode = null; // To track which node is being dragged
let dragSpeedFactor= 0.75;
let offsetX, offsetY; // To store the offset between the mouse click and the node position

function dragNode(event) {
    if (selectedNode !== null) {

        // Instead of directly applying the new position, calculate the movement in small increments
        const currentNode = nodes[selectedNode];

        // Get the target position based on the mouse's movement
        const targetX = event.clientX - offsetX;
        const targetY = event.clientY - offsetY;

        // Smoothly update the node's position by only moving a fraction of the distance to the target
        currentNode.x += Math.round(((targetX - currentNode.x) * dragSpeedFactor )/5 ) *5;
        currentNode.y += Math.round(((100 - targetY - currentNode.y) * dragSpeedFactor)/5 ) * 5; // Adjust for SVG coordinate system
        

        // Update the SVG node circle position
        const nodeCircle = document.getElementById(`node${selectedNode + 1}circle`);
        nodeCircle.setAttribute('cx', currentNode.x);
        nodeCircle.setAttribute('cy', 100 - currentNode.y);

        // Redraw the elements since the nodes have moved
        initializeGUI();
        updateElements();
        updateComponents()
        initializeGUI();
        keepNodeSelected(selectedNodeIndex)
    }
}

function stopDragging() {
    // Stop dragging once the mouse is released
    selectedNode = null;
    document.removeEventListener('mousemove', dragNode);
    document.removeEventListener('mouseup', stopDragging);

    
    initializeGUI();
    updateNodes();
    updateElements();
    updateComponents()
    initializeGUI();

    // unSelectNode(selectedNodeIndex)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////// move the nodes around with keyboard /////////////////////////////////////////

let selectedNodeIndex = null;

// Function to handle node selection
function selectNode(index, circle) {
    document.querySelectorAll('.nodeSvg').forEach((node, index) => {
        node.classList.remove('activeNode');
    });

    // Add the 'selectedNode' class to the clicked node
    circle.classList.add('activeNode');

    selectedNodeIndex = index;

    return index;
}

function keepNodeSelected(index) {
    document.querySelectorAll('.nodeSvg')[index].classList.add('activeNode');
};

function unSelectNode(index) {
    document.querySelectorAll('.nodeSvg')[index].classList.remove('activeNode');
};


document.addEventListener("keydown", (event) => {
    if (selectedNodeIndex != null) {
        const key = event.key;

        if (key === "w" || key === "W") {
            nodes[selectedNodeIndex].y += 5;
        } else if (key === "s" || key === "S") {
            nodes[selectedNodeIndex].y -= 5;
        } else if (key === "a" || key === "A") {
            nodes[selectedNodeIndex].x -= 5;
        } else if (key === "d" || key === "D") {
            nodes[selectedNodeIndex].x += 5;
        }

        initializeGUI();
        updateNodes();
        updateElements();
        updateComponents()
        initializeGUI();

        keepNodeSelected(selectedNodeIndex)

    }
});

document.querySelectorAll('.body-section').forEach((tag) => {
tag.addEventListener('click', () => {selectedNodeIndex = null;});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////// Initialize Adjacency Matrix ////////////////////////////////////////////////////////////

function CreateAdjacencyMatrix(){
    const letters = ['A1', 'B2', 'C3', 'D4', 'E5']
    const n = nodes.length;
    const e = elements.length;
    let matrix = Array.from({ length: n }, () => Array(n).fill(0));
    for(let i = 0; i < n; i++){
        let currentNode = nodes[i];
        for(let j = 0; j < e; j++){
            let currentElement = elements[j];
            if(currentElement.Ni == currentNode){
                    matrix[i][nodes.findIndex(obj => obj === currentElement.Nf)] = letters[j];
            }
        }
    }
    // console.log(matrix);
    return matrix;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", initializeGUI);
document.getElementById('updateResults').addEventListener('click', CreateAdjacencyMatrix);
