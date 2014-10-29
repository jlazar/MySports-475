var boxNumber = "";
var nextBoxNumber = 2

function displayData(box, t, data, dataCategory) {
	console.log("ASDASDASDASDASDASDASDASDASD");
		switch (dataCategory) {
			case "player":
				console.log("PLAYER DATA HERE");
				console.log(data);
				thatData = data;
				var statsHTML = setHTML(data);
				$(box + ' .sportsContent').html(statsHTML);
				break;
			case "team":
				$(box + ' .sportsContent').html("<b>"+t+" &nbsp;" +"</b><br /><b>Offense</b><br/> Total Touchdowns: &nbsp;" + data.touchdowns.total+"<br /><br/><b>Defense</b><br/> Forced fumbles: &nbsp;"+data.defense.force_fum+"<br />Interceptions: &nbsp;"+data.defense.int+"<br/>Punts: &nbsp;"+data.punting.punts);
				break;
			case "stats":
				break;
			default:
				break;
		}
	}

function setHTML(data) {
	var position = data.position;
	var str = "<b>"+data.position+" &nbsp;" + data.name_full+"</b><br />";
	str += "<table class='player-stats-table'>";
	switch(position) {
		case "WR":
			str += "<tr><td>Total TDs: </td><td>" + data.touchdowns.total + "</td></tr>";
			str += "<tr><td>Receptions: </td><td>" + data.receiving.rec + "</td></tr>";
			str += "<tr><td>Yards: </td><td>" + data.receiving.yds + "</td></tr>";
			str += "<tr><td>Long: </td><td>" + data.receiving.lg + "</td></tr>";
			str += "<tr><td>First Downs: </td><td>" + data.receiving.fd + "</td></tr>";
			break;
		case "QB":
			str += "<tr><td>Passing Attempts: </td><td>" + data.passing.att + "</td></tr>";
			str += "<tr><td>Completions: </td><td>" + data.passing.cmp + "</td></tr>";
			str += "<tr><td>Yards: </td><td>" + data.passing.yds + "</td></tr>";
			str += "<tr><td>Touchdowns: </td><td>" + data.passing.td + "</td></tr>";
			str += "<tr><td>INTs: </td><td>" + data.passing.int + "</td></tr>";
			str += "<tr><td>QBR: </td><td>" + data.passing.rating + "</td></tr>";
			break;
		case "RB":
			str += "<tr><td>Rushing Attempts: </td><td>" + data.rushing.att + "</td></tr>";
			str += "<tr><td>Rushing Yards: </td><td>" + data.rushing.yds + "</td></tr>";
			str += "<tr><td>Average: </td><td>" + data.rushing.avg + "</td></tr>";
			str += "<tr><td>Rushing TDs: </td><td>" + data.rushing.td + "</td></tr>";
			str += "<tr><td>Receptions: </td><td>" + data.receiving.rec + "</td></tr>";
			str += "<tr><td>Receiving Yards: </td><td>" + data.receiving.yds + "</td></tr>";
			str += "<tr><td>Receiving TDs: </td><td>" + data.receiving.td + "</td></tr>";
			break;
		default:
			break;
	}
	str += "</table>";
	return str;
}

function popup(box) {
	console.log("HAPPENING");
	$("#teamRadio").prop("checked", true);
	document.getElementById("players").style.display = "none";
	document.getElementById("dialog-form").style.display = "block";
	document.getElementById("submit").style.display = "block";
	boxNumber = "";
	boxNumber = box;
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function populatePlayerList(t){
	console.log('populatePlayerList');
    var select = document.getElementById("playerList");

    select.options.length = 0;
    $.ajax({
		type: "POST",
		dataType: "json",
	  url: "/getTeamRoster",
	  data: {teamName: t}
	}).done(function(data) {
	  //alert("done");
	  console.log("done");
	  console.log(data);
	   for (var i = 0; i < data.length - 1; i++) {
        var opt = data[i].player.name_full;
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }
	}).fail(function(xhr, status, error){
		//alert("fail");
		console.log(xhr);
		console.log(status);
		console.log(error);
	});

}

function getData (box, urlText, dataCategory, t, d) {
		t = t.toUpperCase();

		$.ajax({

		type: "POST",
		dataType: "json",
	  	url: urlText,
	  	data: d
		}).done(function(data) {

		  console.log("done");
		  console.log(data);
		  displayData(box, t, data, dataCategory);
		}).fail(function(xhr, status, error){
			console.log(xhr);
			console.log(status);
			console.log(error);
		});
		return true;
}


$(function() {
 	$( "input" ).on( "click", function() {
 		if ($("input[name='category']:checked").val() == "player") {
 			document.getElementById("players").style.display = "block";
 			var e = document.getElementById("teams");
			var strUser = e.options[e.selectedIndex].value;
			populatePlayerList(strUser);
 		}
 		if ($("input[name='category']:checked").val() == "team") {
 			document.getElementById("players").style.display = "none";
 		}
 		return true;
 	});



	$( "#sortable" ).sortable();
	$( "#sortable" ).disableSelection();


	$('.form').on('submit', function (e) {
		e.preventDefault();
		document.getElementById("dialog-form").style.display = "none";

    var category = $(this).find("input[name='category']:checked").val()
    var t = $(this).find('select[name="team"]').val();
    var p = $(this).find('select[name="player"]').val();

	    switch(category) {
	    	case "team":
	    		console.log("IN CASE STATEMENT TEAM");
	    		d = {team: t}
	    		getData(boxNumber, "/getTeamInfo", category, t, d);
	    		break;
	    	case "player":
		    	console.log("IN CASE STATEMENT PLAYER");
		    	d = { player: p, team: t};
		    	getData(boxNumber, "/getPlayerInfo", category, t, d);
	    		break;
	    	default:
		    	console.log("IN CASE STATEMENT DEFAULT");
	    		break;

	    }

	    nextBoxID = "box" + nextBoxNumber;
	   	$('#sortable').append('<li class="ui-state-default" id="' + nextBoxID + '"><div class="sportsWrapper"><div class="sportsContent"><a id = "' + nextBoxID + '" onclick="popup(\'#' + nextBoxID + '\')" class="button addNew">Add Sports Data</a></div></div></li>')
	    nextBoxNumber += 1;

	    // deferred = $.post("http://somewhere.com", { val: val });

	    // deferred.success(function () {
	    //     Do your stuff.
	    // });

	    // deferred.error(function () {
     //    Handle any errors here.});

	});

	$('.teamList').on('change', function () {
		if ($("input[name='category']:checked").val() == "player") {
		    //player is checked so populate team list
		    var e = document.getElementById("teams");
				var strUser = e.options[e.selectedIndex].value;
				populatePlayerList(strUser);
		}
		return true
	});

	// var boxOne = "#box1";
	// $.ajax({
	// 	type: "GET",
	// 	dataType: "json",
	//   url: "/getNFLStandings"
	// }).done(function(data) {
	//   console.log("standings done yo");
	//   console.log(data);
	//   team0 = data.teams[0]['name']
	//   team1 = data.teams[1]['name']
	//   team2 = data.teams[2]['name']
	//   team3 = data.teams[3]['name']
	//   console.log(team0)
	//   $(boxOne + ' .sportsContent').html("<b><u> Standings </u></b><br />" + team0 + "<br />" + team1 + "<br />" + team2 + "<br />" + team3);
	// }).fail(function(xhr, status, error){
	// 	console.log(xhr);
	// 	console.log(status);
	// 	console.log(error);
	// });


	// var p = "Antonio Brown"
	// var t = "PIT"
	// var box = '#box3'

	// $.ajax({
	// 	type: "POST",
	// 	dataType: "json",
	//   url: "/getPlayerInfo",
	//   data: { player: p, team: t}
	// }).done(function(data) {
	//   console.log("done");
	//   console.log(data);
	//   $(box + ' .sportsContent').html("<b>"+data.position+" &nbsp;" + data.name_full+"</b><br /><hr>Touchdowns: &nbsp;" + data.touchdowns.total+"</b><br />College: &nbsp;" + data.college +"</b><br />Draft Pick: &nbsp;" + data.draft_pick + "</b><br />Height: &nbsp;" + data.height + "in");
	// }).fail(function(xhr, status, error){
	// 	console.log(xhr);
	// 	console.log(status);
	// 	console.log(error);
	// });


	// var p2 = "Sammy Watkins"
	// var t2 = "BUF"
	// var box2 = '#box2'

	// $.ajax({
	// 	type: "POST",
	// 	dataType: "json",
	//   url: "/getPlayerInfo",
	//   data: { player: p2, team: t2}
	// }).done(function(data) {
	//   console.log("done");
	//   console.log(data);
	//   $(box2 + ' .sportsContent').html("<b>"+data.position+" &nbsp;" + data.name_full+"</b><br /><hr>Touchdowns: &nbsp;" + data.touchdowns.total+"</b><br />College: &nbsp;" + data.college +"</b><br />Draft Pick: &nbsp;" + data.draft_pick + "</b><br />Height: &nbsp;" + data.height + "in");
	// }).fail(function(xhr, status, error){
	// 	console.log(xhr);
	// 	console.log(status);
	// 	console.log(error);
	// });

	// var p4 = "Cody Parkey"
	// var t4 = "PHI"
	// var box4 = '#box4'

	// $.ajax({
	// 	type: "POST",
	// 	dataType: "json",
	//   url: "/getPlayerInfo",
	//   data: { player: p4, team: t4}
	// }).done(function(data) {
	//   console.log("done");
	//   console.log(data);
	//   $(box4 + ' .sportsContent').html("<b>"+data.position+" &nbsp;" + data.name_full+"</b><br /><hr>Attempts: &nbsp;" + data.field_goal.att+"</b><br /><hr>Made: &nbsp;" + data.field_goal.made+"</b><br />College: &nbsp;" + data.college +"</b><br />Draft Pick: &nbsp;" + data.draft_pick + "</b><br />Height: &nbsp;" + data.height + "in");
	// }).fail(function(xhr, status, error){
	// 	console.log(xhr);
	// 	console.log(status);
	// 	console.log(error);
	// });

	// var p5 = "DeMarco Murray"
	// var t5 = "DAL"
	// var box5 = '#box5'

	// $.ajax({
	// 	type: "POST",
	// 	dataType: "json",
	//   url: "/getPlayerInfo",
	//   data: { player: p5, team: t5}
	// }).done(function(data) {
	//   console.log("done");
	//   console.log(data);
	//   $(box5 + ' .sportsContent').html("<b>"+data.position+" &nbsp;" + data.name_full+"</b><br /><hr>Touchdowns: &nbsp;" + data.touchdowns.total+"</b><br /><hr>Rushing Yards: &nbsp;" + data.rushing.yds+"</b><br />College: &nbsp;" + data.college +"</b><br />Draft Pick: &nbsp;" + data.draft_pick + "</b><br />Height: &nbsp;" + data.height + "in");
	// }).fail(function(xhr, status, error){
	// 	console.log(xhr);
	// 	console.log(status);
	// 	console.log(error);
	// });

	// var p6 = "Andrew Luck"
	// var t6 = "IND"
	// var box6 = '#box6'

	// $.ajax({
	// 	type: "POST",
	// 	dataType: "json",
	//   url: "/getPlayerInfo",
	//   data: { player: p6, team: t6}
	// }).done(function(data) {
	//   console.log("done");
	//   console.log(data);
	//   $(box6 + ' .sportsContent').html("<b>"+data.position+" &nbsp;" + data.name_full+"</b><br /><hr>Touchdowns: &nbsp;" + data.touchdowns.total+"</b><br /><hr>Passing Touchdowns: &nbsp;" + data.passing.td+"</b><br /><hr>Passing Yards: &nbsp;" + data.passing.yds+"</b><br />College: &nbsp;" + data.college +"</b><br />Draft Pick: &nbsp;" + data.draft_pick + "</b><br />Height: &nbsp;" + data.height + "in");
	// }).fail(function(xhr, status, error){
	// 	console.log(xhr);
	// 	console.log(status);
	// 	console.log(error);
	// });

	// var p7 = "Donnie Jones"
	// var t7 = "PHI"
	// var box7 = '#box7'

	// $.ajax({
	// 	type: "POST",
	// 	dataType: "json",
	//   url: "/getPlayerInfo",
	//   data: { player: p7, team: t7}
	// }).done(function(data) {
	//   console.log("done");
	//   console.log(data);
	//   $(box7 + ' .sportsContent').html("<b>"+data.position+" &nbsp;" + data.name_full+"</b><br /><hr>Punts: &nbsp;" + data.punting.punts+"</b><br />College: &nbsp;" + data.college +"</b><br />Draft Pick: &nbsp;" + data.draft_pick + "</b><br />Height: &nbsp;" + data.height + "in");
	// }).fail(function(xhr, status, error){
	// 	console.log(xhr);
	// 	console.log(status);
	// 	console.log(error);
	// });
});
