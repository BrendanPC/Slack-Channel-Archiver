var SLACK_URL = "https://slack.com/api/";
var PATTERN = "";
var TOKEN;
var CHANNELS;

// Setup and display functions
window.addEventListener('load', function() {
	var getChannelsButton = document.getElementById('getChannels');
	getChannelsButton.addEventListener('click', function() {
		TOKEN = document.getElementById('tokenInput').value;
		PATTERN = document.getElementById('patternInput').value;
		getChannels();
	});
	
	var archiveButton = document.getElementById('archiveButton');
	archiveButton.addEventListener('click', doArchive);
	archiveButton.style.display = "none";
});

function write(text) {
	document.getElementById('textWindow').innerHTML += text + "<br>";
}

function clean() {
	document.getElementById('textWindow').innerHTML = "";
}

// Get, filter, archive channels
function getChannels() {
	clean();
    var channelsListRequest = {
        token: TOKEN,
        exclude_archived: "1"
    };

    $.post(SLACK_URL + "channels.list", channelsListRequest, filterChannels);
}

function filterChannels(data, textStatus) {
	write("<b>Matching channels:<b>");
    if (textStatus !== "success") {
        write("Channel List request failed: Check your token");
        return;
    }

	if(!data.channels) {
		write("No channels found");
		return;
	}
	
    CHANNELS = data.channels.filter(function(element, index, array) {
        if(!!(element.name.match(PATTERN))) {
			write(element.name);
			return true;
		}
		return false;
    });
	
	if(CHANNELS.length === 0) {
		write("No channels matched pattern. These are all existing un-archived channels:");
		$.each(data.channels, function(i, value) { 
			write(value.name);
		});
	}
	else {
		document.getElementById('archiveButton').style.display = "block";
	}
}

function doArchive() {
	write("Archiving...");
    for (var i = 0; i < CHANNELS.length; i++) {
        var channel = CHANNELS[i];
        var archiveRequest = {
            token: TOKEN,
            channel: channel.id
        };
		
        $.post(SLACK_URL + "channels.archive", archiveRequest, function(data, status) {
		console.log(data);
		console.log(status);
        });
    }
	write("Done!");
}