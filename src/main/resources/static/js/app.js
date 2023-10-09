// Variable que almacenará la implementación actual
var implementation = 'apiclient';

// Comprueba la implementación seleccionada
if (implementation === 'apimock') {
    api = apimock;
} else if (implementation === 'apiclient') {
    api = apiclient;
} else {
    console.error("Implementación no válida: " + implementation);
}

var app = (function () {
    var selectedAuthor = "";

    // Función privada para agregar filas a la tabla
    function addRowToTable(name, points) {
        var table = document.querySelector('table');
        var tbody = table.querySelector('tbody');
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


    // Función privada para dibujar un plano
    function drawBlueprint(points) {
        var canvas = document.getElementById('blueprintCanvas');
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

    // Operación pública para cambiar el nombre del autor actualmente seleccionado
    function setAuthorName(authorName) {
        selectedAuthor = authorName;
    }

    // Operación pública para actualizar el listado de planos por autor
    function updateBlueprintsList(authorName) {
        setAuthorName(authorName);
        var table = document.querySelector('table');
        var tbody = table.querySelector('tbody');
        // Eliminar todas las filas del tbody
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        api.getBlueprintsByAuthor(authorName, function (error, blueprints) {
            var totalPointsElement = document.getElementById('totalPoints');
            if (error) {
                totalPointsElement.textContent = 'author not found';
            } else {
                // Procesar los planos exitosamente
                console.log("Planos obtenidos exitosamente:", blueprints);
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
                totalPointsElement.textContent = 'Total de puntos: ' + totalPoints;
            }
        });
    }

    // Operación pública para dibujar un plano por nombre de autor y nombre de plano
    function drawBlueprintByNameAndAuthor(authorName, bpname) {
        api.getBlueprintsByNameAndAuthor(authorName, bpname, function (blueprint) {
            if (blueprint) {
                drawBlueprint(blueprint.points);
                var blueprintNameField = document.getElementById('blueprintName');
                if (!blueprintNameField) {
                    blueprintNameField = document.createElement('p');
                    blueprintNameField.id = 'blueprintName';
                    document.getElementById('right-panel').appendChild(blueprintNameField);
                }
                blueprintNameField.textContent = 'Drawn: ' + bpname;
            }
        });
    }

    // Obtener el botón de consulta por su ID
    var getBlueprintsButton = document.getElementById('getBlueprintsButton');

    // Asociar la operación updateBlueprintsList al evento 'click' del botón
    getBlueprintsButton.addEventListener('click', function () {
        // Obtener el nombre del autor desde el campo de entrada
        var authorNameInput = document.getElementById('authorInput');
        var authorName = authorNameInput.value;

        // Llamar a la operación updateBlueprintsList con el nombre del autor
        updateBlueprintsList(authorName);
    });

    // Exponer métodos públicos
    return {
        setAuthorName: setAuthorName,
        updateBlueprintsList: updateBlueprintsList,
        drawBlueprintByNameAndAuthor: drawBlueprintByNameAndAuthor
    };
})();
