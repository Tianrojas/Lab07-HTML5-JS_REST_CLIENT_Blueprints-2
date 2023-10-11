// Variable to store the current implementation
var implementation = 'apiclient';

// Check the selected implementation
if (implementation === 'apimock') {
    api = apimock;
} else if (implementation === 'apiclient') {
    api = apiclient;
} else {
    console.error("Invalid implementation: " + implementation);
}

var app = (function () {
    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');
    const totalPointsElement = document.getElementById('totalPoints');
    let blueprintNameField = document.getElementById('blueprintName');
    const canvas = document.getElementById('blueprintCanvas');
    const getBlueprintsButton = document.getElementById('getBlueprintsButton');
    const authorNameInput = document.getElementById('authorInput');
    const saveUpdateButton = document.getElementById('saveUpdateButton');
    const createBlueprintButton = document.getElementById('createBlueprintButton');
    const rightPanel = document.getElementById('right-panel')

    let selectedAuthor = "";
    let currentBlueprintPoints = [];
    let currentBlueprintName = "";


    function addRowToTable(name, points) {
        var row = document.createElement('tr');
        var nameCell = document.createElement('td');
        var pointsCell = document.createElement('td');
        var drawButtonCell = document.createElement('td');
        var drawButton = document.createElement('button');

        nameCell.textContent = name;
        pointsCell.textContent = points;

        drawButton.textContent = 'open';
        drawButton.className = 'open-button';
        drawButton.addEventListener('click', function () {
            drawBlueprintByNameAndAuthor(selectedAuthor, name);
        });

        row.appendChild(nameCell);
        row.appendChild(pointsCell);
        drawButtonCell.appendChild(drawButton);
        row.appendChild(drawButtonCell);

        tbody.appendChild(row);
    }

    function drawBlueprint(points) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.closePath();
    }

    function setAuthorName(authorName) {
        selectedAuthor = authorName;
    }

    function updateBlueprintsList(authorName) {
        return new Promise(function (resolve, reject) {
            setAuthorName(authorName);
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            api.getBlueprintsByAuthor(authorName, function (error, blueprints) {
                if (error) {
                    totalPointsElement.textContent = 'Author not found';
                    reject(error);
                } else {
                    console.log("Blueprints obtained successfully:", blueprints);
                    var mappedBlueprints = blueprints.map(function (bp) {
                        return {
                            name: bp.name,
                            points: bp.points.length
                        };
                    });
                    var totalPoints = mappedBlueprints.reduce(function (total, bp) {
                        addRowToTable(bp.name, bp.points);
                        return total + bp.points;
                    }, 0);
                    totalPointsElement.innerHTML = '<strong>Total points:</strong> ' + totalPoints;
                    resolve();
                }
            });
            currentBlueprintPoints = [];
            drawBlueprint(currentBlueprintPoints);
        });
    }

    function drawBlueprintByNameAndAuthor(authorName, bpname) {
        return new Promise(function (resolve, reject) {
            api.getBlueprintsByNameAndAuthor(authorName, bpname, function (blueprint) {
                if (blueprint) {
                    drawBlueprint(blueprint.points);
                    setCurrentBlueprintName(bpname);
                    if (!blueprintNameField) {
                        blueprintNameField = document.createElement('p');
                        blueprintNameField.id = 'blueprintName';
                        rightPanel.appendChild(blueprintNameField);
                    }
                    blueprintNameField.innerHTML = '<strong>Drawn:</strong> ' + bpname;
                    resolve();
                } else {
                    reject("Blueprint not found");
                }
            });
        });
    }

    function setCurrentBlueprintName(name) {
        currentBlueprintName = name;
    }

    canvas.addEventListener('click', function (event) {
        if (event.clientX !== undefined && event.clientY !== undefined) {
            var canvasRect = canvas.getBoundingClientRect();
            var x = event.clientX - canvasRect.left;
            var y = event.clientY - canvasRect.top;
            currentBlueprintPoints.push({ x: x, y: y });
            drawBlueprint(currentBlueprintPoints);
        }
    });

    getBlueprintsButton.addEventListener('click', function () {
        var authorName = authorNameInput.value;
        updateBlueprintsList(authorName).catch(function (error) {
            console.error("Error fetching blueprints: " + error);
        });
    });

    saveUpdateButton.addEventListener('click', function () {
        if (selectedAuthor && currentBlueprintName && currentBlueprintPoints.length > 0) {
            var updatedBlueprint = {
                name: currentBlueprintName,
                author: selectedAuthor,
                points: currentBlueprintPoints
            };
            var saveOrUpdatePromise;
            var blueprintNames = Array.from(document.querySelectorAll('table tbody tr td:first-child')).map(function (cell) {
                return cell.textContent;
            });
            if (blueprintNames.includes(currentBlueprintName)) {
                saveOrUpdatePromise = api.updateBlueprint(selectedAuthor, currentBlueprintName, updatedBlueprint);
            } else {
                saveOrUpdatePromise = api.createBlueprint(updatedBlueprint);
            }
            saveOrUpdatePromise
                .then(function () {
                    return updateBlueprintsList(selectedAuthor);
                })
                .then(function () {
                    console.log("Blueprint saved/updated successfully");
                })
                .catch(function (error) {
                    console.error("Error saving/updating blueprint: " + error);
                });
        }
    });

    createBlueprintButton.addEventListener('click', function () {
        if (selectedAuthor === ""|| totalPointsElement.textContent === 'Author not found') {
            alert("Blueprint name already exists. Please choose another name.");
        } else {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            currentBlueprintPoints = [];
            var uniqueName = false;
            var newBlueprintName;
            while (!uniqueName) {
                newBlueprintName = prompt("Enter the name of the new blueprint:");
                if (!newBlueprintName) {
                    return;
                }

                var blueprintNames = Array.from(document.querySelectorAll('table tbody tr td:first-child')).map(function (cell) {
                    return cell.textContent;
                });

                if (!blueprintNames.includes(newBlueprintName)) {
                    uniqueName = true;
                } else {
                    alert("Blueprint name already exists. Please choose another name.");
                }
            }
            currentBlueprintName = newBlueprintName;
            if (!blueprintNameField) {
                blueprintNameField = document.createElement('p');
                blueprintNameField.id = 'blueprintName';
                rightPanel.appendChild(blueprintNameField);
            }
            blueprintNameField.textContent = '';
        }
    });

    var deleteBlueprintButton = document.getElementById('deleteBlueprintButton');

    deleteBlueprintButton.addEventListener('click', function () {
        if (selectedAuthor && currentBlueprintName) {
            var deleteConfirmation = confirm('Are you sure you want to delete this blueprint?');
            if (deleteConfirmation) {
                deleteBlueprint(selectedAuthor, currentBlueprintName)
                    .then(function () {
                        return updateBlueprintsList(selectedAuthor);
                    })
                    .then(function () {
                        blueprintNameField.textContent = '';
                        console.log('Blueprint deleted successfully');
                    })
                    .catch(function (error) {
                        console.error('Error deleting blueprint: ' + error);
                    });
            }
        }
    });

    function deleteBlueprint(author, bpname) {
        return new Promise(function (resolve, reject) {
            api.deleteBlueprint(author, bpname)
                .then(function () {
                    resolve();
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }

    return {
        setAuthorName: setAuthorName,
        updateBlueprintsList: updateBlueprintsList,
        drawBlueprintByNameAndAuthor: drawBlueprintByNameAndAuthor
    };
})();
