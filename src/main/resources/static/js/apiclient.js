apiclient = (function(){

    return {
        getBlueprintsByAuthor: function(author, callback) {
            $.ajax({
                type: 'GET',
                url: 'blueprints/' + author,
                success: function(data) {
                    callback(null, data);
                },
                error: function(error) {
                    console.error("Error en la petición GET: " + error);
                    callback(error, null);
                }
            });
        }        ,

        getBlueprintsByNameAndAuthor: function(author, bpname, callback){
            $.ajax({
                type: 'GET',
                url: 'blueprints/' + author + "/" + bpname,
                success: function(data) {
                    callback(data);
                },
                error: function(error) {
                    console.error("Error en la petición GET: " + error);
                }
            })
        }
    }
})();

