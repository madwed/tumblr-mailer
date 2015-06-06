var fs = require("fs");
var ejs = require("ejs");
var tumblr = require("tumblr.js");
var mandrill = require("mandrill-api/mandrill");

var mandrillKey = fs.readFileSync("mandrill_key.txt");

var mandrill_client = new mandrill.Mandrill(mandrillKey);

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }

var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var emailTemplate = fs.readFileSync("email_template.ejs", "utf8");

var tumblrKey = fs.readFileSync("tumblr_key.txt", "utf8");
tumblrKey = JSON.parse(tumblrKey);

var client = tumblr.createClient(tumblrKey);
var latestPosts = client.posts("codefishandchips.tumblr.com", function(err, blog){
	if(err){ return console.log(err); }
	var oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
	var latestPosts = blog.posts.filter(function(post){
		var postDate = Date.parse(post.date);
		if(postDate > oneWeekAgo){
			return true;
		}
		return false;
	});

	var csv_data = csvParse(csvFile);

	csv_data.forEach(function(row){
		row.latestPosts = latestPosts;
		var templateCopy = ejs.render(emailTemplate, row);
		console.log(templateCopy);
	});
});

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
