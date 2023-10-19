const Airtable = require('airtable');
var targetBase = new Airtable({apiKey: process.env.AIRTABLE_APIKEY}).base('appYxGfxyYoDmUauq');

const leccSync = async (mode) => {

    let functionStart = Date.now()
    let time = "Nothing to export"

    let base;
    let table;
    let view;
    let name;
    let dvr;
    let start;
    let end;
    let checkbox;
    let fields;
    let brand;
    let geoblocking;
    let topic;
    let platforms;
    let localization;
    let confirmedLanguages;
    let recordLink;
    let assetId;
    let cornerbug;
    let teamslink;
    let typecast = true;

    if(mode === "rbtv"){
        base = new Airtable({apiKey: process.env.AIRTABLE_APIKEY}).base('appTDzZIAs6Mp5rKR');
        table = "tblcBcHOX50iZfF2J"
        view = "viwdbtjlHj34IpvQI"
        start = "fldkXpnvqRHAyCQ3k"
        end = "flddKwg8N7VJRCVm6"
        name = "fldGuz3ElJbLPgaaa"
        checkbox = "fldSePqvqlfw8nEFw"
        platforms = "fld7z3eslQIe2fgsq"
        localization = "fldYx4rO1aBrEJO0g"
        confirmedLanguages = "fldYxfkMRCLFjLKDy"
        recordLink = "https://airtable.com/appTDzZIAs6Mp5rKR/" + table + "/" + view + "/"
        brand = "RBMN"
        fields = [start, end, name, checkbox, platforms, localization, confirmedLanguages]
        console.log("RBMN LECC Sync started")
    } else if(mode === "stv"){
        base = new Airtable({apiKey: process.env.AIRTABLE_APIKEY}).base('appJLPNSIXnunD5Qn');
        table = "tbl0ENWlOsnjDaw5f"
        view = "viwZZRVqdvciASiPQ"
        start = "fld0u3iJmSxKXo8BI"
        end = "fldRpqqfO2pNvfPbs"
        name = "fldJkj3hqICIQE3lW"
        topic = "fldCEBd01a0Rb2Yu1"
        checkbox = "fldhHf4IyZpOtS7oG"
        dvr = "fldCRPEpJddTF3PsX"
        brand = "STV"
        geoblocking = "fldyvJpR9NJbl7TzB"
        assetId = "fldLe62fH8jixHnDY"
        cornerbug="flduDCXxITqfdekXe"
        teamslink="fldZ6DxYc9N1nL09W"
        recordLink = "https://airtable.com/appJLPNSIXnunD5Qn/" + table + "/" + view + "/"
        fields = [start, end, name, checkbox, dvr, geoblocking, topic, assetId, cornerbug, teamslink]
        console.log("STV LECC Sync started")
    } else {
        throw Error("No compatible mode selected")
    }



    let airtableConfirmation = await new Promise((resolve, reject) => {

        base(table).select({
            view: view,
            returnFieldsByFieldId: true,
            fields: fields
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            if(records.length === 0)
                resolve("no Events to export")

            records.forEach(function(record) {

                console.log('Retrieved', record.get(name));
                recordLink += record.id
                //console.log("Record Url: " + recordLink)

                let fieldsToCreate = {
                    "fields": {
                        "fldMs8WVyPrRfyg9O": record.get(name),
                        "fldnBT2ejX4SQiHt3": record.get(start),
                        "fldbci5s5632lg7hV": record.get(end),
                        "fldKlKUcBSKgA7M8w": record.get(dvr) !== undefined ? record.get(dvr)[0] === "DVR" : true,
                        "fldnAiRVpLTZVKdtd": brand
                    }
                }

                if(mode === "stv") {
                    fieldsToCreate.fields["fldqWroepSfYbq5R6"] = record.get(geoblocking)
                    fieldsToCreate.fields["fldMs8WVyPrRfyg9O"] = record.get(topic) + " - " + record.get(name)
                    fieldsToCreate.fields["fldt7B53VdxZTcORB"] = record.get(assetId)
                    fieldsToCreate.fields["fldEZusR7pA7uqhF2"] = record.get(cornerbug)
                    fieldsToCreate.fields["fldH3lRcQPREgCcKZ"] = record.get(teamslink)
                }

                if(mode === "rbtv"){
                    fieldsToCreate.fields["flddsLT6IzEAUVN5a"] = record.get(platforms).includes("Red Bull TV")
                    fieldsToCreate.fields["fldCbQYMdPg6hwXC0"] = record.get(platforms).includes("Red Bull TV")
                    fieldsToCreate.fields["fldT8JKUEnaKxlNKI"] = record.get(platforms).includes("YouTube")
                    fieldsToCreate.fields["fldskJZSMP75NBImR"] = record.get(platforms).includes("Twitch")
                    fieldsToCreate.fields["fldYOMcMYChTMr5iv"] = record.get(platforms).includes("Facebook")
                    fieldsToCreate.fields["fldbGbGm1CN5C2To5"] = record.get(platforms).includes("TikTok")

                    fieldsToCreate.fields["fldhxFP3LHqgsyQIb"] = record.get(localization)
                    fieldsToCreate.fields["fldXysseW1FUUH48A"] = record.get(localization)

                    fieldsToCreate.fields["fldVqPSxcpMp9wauh"] = record.get(confirmedLanguages)

                    fieldsToCreate.fields["fld1G3eI8X6S6ryRx"] = `[Link](${recordLink}) to Live Bible Record`

                }

                //console.log("FieldsToCreate: ", fieldsToCreate)

                targetBase('tblG8SInzmcryDUun').create([
                    fieldsToCreate
                ], {typecast: typecast}, function (err, newRecords) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log("Record " + newRecords[0].getId() + " created")
                    record.updateFields({[checkbox]: true}).then((res) => {
                        console.log("Checkbox updated for " + newRecords[0].getId() + " => " + res.getId())
                    })
                });
            });

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();

        }, function done(err) {
            if (err) { console.error(err); reject(err); }
            resolve("done")
        });
    })


    let functionEnd = Date.now()

    if (airtableConfirmation === "done")
        time = "Time: " + (functionEnd - functionStart) + " ms"

    if(airtableConfirmation === "no Events to export")
        time = airtableConfirmation

    //console.log(time)
    return time

}

module.exports = leccSync