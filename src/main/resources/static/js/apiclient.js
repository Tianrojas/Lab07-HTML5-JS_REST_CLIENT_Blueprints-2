var apiclient = (function () {
    function getBlueprintsByAuthor(author, callback) {
        $.ajax({
            type: 'GET',
            url: 'blueprints/' + author,
            success: function (data) {
                callback(null, data);
            },
            error: function (error) {
                console.error("Error en la petición GET: " + error);
                callback(error, null);
            }
        });
    }

    function getBlueprintsByNameAndAuthor(author, bpname, callback) {
        $.ajax({
            type: 'GET',
            url: 'blueprints/' + author + "/" + bpname,
            success: function (data) {
                callback(data);
            },
            error: function (error) {
                console.error("Error en la petición GET: " + error);
            }
        });
    }

    function updateBlueprint(author, bpname, blueprint) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: 'blueprints/' + author + '/' + bpname,
                type: 'PUT',
                data: JSON.stringify(blueprint),
                contentType: 'application/json',
                success: function () {
                    resolve();
                },
                error: function (error) {
                    console.error("Error en la petición PUT: " + error);
                    reject(error);
                }
            });
        });
    }

    function createBlueprint(blueprint) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: 'blueprints',
                type: 'POST',
                data: JSON.stringify(blueprint),
                contentType: 'application/json',
                success: function () {
                    resolve();
                },
                error: function (error) {
                    console.error("Error en la petición POST: " + error);
                    reject(error);
                }
            });
        });
    }

    function deleteBlueprint(author, bpname) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: 'blueprints/' + author + '/' + bpname,
                type: 'DELETE',
                success: function () {
                    resolve();
                },
                error: function (error) {
                    console.error('Error en la petición DELETE: ' + error);
                    reject(error);
                }
            });
        });
    }

    return {
        getBlueprintsByAuthor: getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor: getBlueprintsByNameAndAuthor,
        updateBlueprint: updateBlueprint,
        createBlueprint: createBlueprint,
        deleteBlueprint: deleteBlueprint
    };
})();
