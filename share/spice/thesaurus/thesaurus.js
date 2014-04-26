(function(env) {    
    env.ddg_spice_thesaurus = function(api_result) {
        "use strict";

        if (!api_result){
            return;
        }

        // Get the query and the mode (trigger words)
        // The mode tells us what to return
        // e.g. you want the antonym but not the synonym
        var script = $('[src*="/js/spice/thesaurus/"]')[0],
            source = $(script).attr("src"),
            match  = source.match(/\/js\/spice\/thesaurus\/([^\/]+)\/([^\/]+)/),
            query  = match[1],
            mode   = match[2];

        var shorthand = {
            "synonyms"  : "syn",
            "synonym"   : "syn",
            "antonyms"  : "ant",
            "antonym"   : "ant",
            "related"   : "rel",
            "similar"   : "sim",
            "thesaurus" : "syn"
        };

        // Create the header.
        var header = "Thesaurus";
        if(shorthand[mode] === "syn") {
            header = "Synonyms of " + query;
        } else if(shorthand[mode] === "ant") {
            header = "Antonyms of " + query;
        } else if(shorthand[mode] === "rel") {
            header = "Related to " + query;
        } else if(shorthand[mode] === "sim") {
            header = "Similar to " + query;
        }

        // Check if the mode exists.
        var how_many = 0;
        for(var i in api_result) {
            if(api_result.hasOwnProperty(i) && (shorthand[mode] in api_result[i])) {
                how_many += 1;
            }
        }
        if(how_many === 0) {
            return;
        }

        api_result.mode = shorthand[mode];

        // Create the plugin.
        Spice.add({
            id: 'thesaurus',
            name: 'Thesaurus',
            data:  api_result,
            meta: {
                itemType:  header + " (Big Huge)",
                sourceName:  'Big Huge Thesaurus',
                sourceUrl:  'http://words.bighugelabs.com/' + query,
            },
            templates: {
                detail: Spice.thesaurus.detail
            }
        });
    }
}(this));

// Determine which results to show.
Handlebars.registerHelper("thesaurus_checkWords", function(options) {
    "use strict";

    var results = [],
        mode = this.mode;

    for(var parts_of_speech in this) {
        if(this.hasOwnProperty(parts_of_speech) && this[parts_of_speech][mode]) {
            results.push({
                heading : parts_of_speech.charAt(0).toUpperCase() + parts_of_speech.slice(1),
                words   : this[parts_of_speech][mode].splice(0, 10).join(", ")
            });
        }
    }

    return options.fn(results);
});