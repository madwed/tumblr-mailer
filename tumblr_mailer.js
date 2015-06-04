var fs = require("fs");

var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var emailTemplate = fs.readFileSync("email_template.html", "utf8");

function csvParse(csvFile){
	var contacts = csvFile.split("\n");
	contacts.splice(0, 1);
	for(var contact = 0; contact < contacts.length; contact++){
		var currentContact = contacts[contact];
		if (currentContact.length === 0){ 
			contacts.splice(contact, 1); 
			continue; 
		}
		currentContact = currentContact.split(",");
		contacts[contact] = {
			firstName: currentContact[0],
			lastName: currentContact[1],
			numMonthsSinceContact: currentContact[2],
			emailAddress: currentContact[3]
		}
	}
	return contacts;
}

var csv_data = csvParse(csvFile);

csv_data.forEach(function(row){
	var firstName = row["firstName"];
	var numMonthsSinceContact = row["numMonthsSinceContact"];

	var templateCopy = emailTemplate;

	templateCopy = templateCopy.replace(/FIRST_NAME/gi, firstName).replace(/NUM_MONTHS_SINCE_CONTACT/gi, numMonthsSinceContact);

	console.log(templateCopy);
});


