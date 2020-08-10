/** Version Control Object */
var oVersionInfo = {
	identifier: "ColorSubformsValidation",
	assetType: "fragment",
	description: "Colors the subform containing the failed field",
	currentVersion: 1
};

function InitializeColorSubforms() {
	// Disable Acrobat's field highlighting. The Color
	// Failed Fields action takes care of highlighting fields.
	if (xfa.host.name === "Acrobat") {
		app.runtimeHighlight = false;
	}
}
function DoColorSubforms(oInvalidNode) {
	// If this form is running on a client other than Acrobat
	// (like on the server) then don't run this script
	if (xfa.host.name !== "Acrobat") {
		return;
	}
	var sClassName = oInvalidNode.className;
	// Only contests, so nodes that are <field>s and
	// have name "Selected"
	// Ignore everything else
	if ((sClassName !== "field") ||
		(oInvalidNode.name !== "Selected")) {
		return;
	}
	var nearestContest = oInvalidNode.resolveNode("Contest");
	if (oInvalidNode.errorText === "") {
		// Validation Succeeded					
		xfa.resolveNode(nearestContest.border.somExpression).presence = "invisible";
		return;
	}
	//console.println("valcolor: " + oInvalidNode.somExpression);
	var oFailedBorder = nearestContest.border;
	// Border color
	// Show a solid border with square corners
	var sBorderColor = "51, 102, 255";
	oFailedBorder.presence = "visible";
	//using a right handed stoke ensures the border
	//appears consistent across the entire contest.
	oFailedBorder.hand = "even";
	for (var i = 0; i < 3; i++) {
		var oEdge = oFailedBorder.getElement("edge", i);
		oEdge.presence = "visible";
		oEdge.color.value = sBorderColor;
		oEdge.thickness = "2pt";
		oEdge.stroke = "solid";
		var oCorner = oFailedBorder.getElement("corner", i);
		oCorner.presence = "visible";
		oCorner.color.value = sBorderColor;
		oCorner.thickness = "2pt";
		oCorner.stroke = "solid";
		oCorner.join = "square";
		oCorner.inverted = "0";
		oCorner.radius = "0mm";
	}
	// Background color
	// Show a solid fill color
	var sFillColor = "153, 204, 255";
	// The presence of the border must be visible to show the fill.
	// Hide the edges when the invalid appearance doesn't include
	// changing the border color
	if (oFailedBorder.presence !== "visible") {
		oFailedBorder.presence = "visible";
		oFailedBorder.edge.presence = "invisible";
	}

	// Replace the current fill type with a solid fill
	if (oFailedBorder.fill.oneOfChild.className !== "solid") {
		var oFailedFillType = oFailedBorder.fill.oneOfChild;
		oFailedBorder.fill.nodes.remove(oFailedFillType);
		var oSolid = xfa.form.createNode("solid", "");
		oFailedBorder.fill.nodes.append(oSolid);
	}
	oFailedBorder.fill.color.value = sFillColor;
}
