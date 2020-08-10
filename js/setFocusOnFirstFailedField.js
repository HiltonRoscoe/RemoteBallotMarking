/** Version Control Object */
var oVersionInfo = {
    identifier:    "SetFocusOnFirstFailedField",
    assetType:     "fragment",
    description:   "Sets focus to first failed subform",
    currentVersion: 1 
};

function DoSetFocusOnFirstFailedField(oRootSubform) {
	if (xfa.host.name === "Acrobat") {	
		var oInvalidNodes = oRootSubform.getInvalidObjects();	
		var nCount = oInvalidNodes.length;	
		var lastRace;
		for (var i = 0; i < oInvalidNodes.length; i++)
		{
			//get the closest Contest Node
			var currentRace = oInvalidNodes.item(i).resolveNode("RaceName");
			if (lastRace !== currentRace) {			
				lastRace = currentRace;
				////console.println("bad race " + currentRace.rawValue);
			}	
		}	
		if (nCount > 0) {
			//cannot set focus to Contest			
			var i, output = "";
			// Remember when we started
			var start = new Date().getTime();
			XFAUtil.scrollTo(oInvalidNodes.item(0).resolveNode("Contest"));
			// Remember when we finished
			var end = new Date().getTime();
			// Now calculate and output the difference    
			//console.println(end - start);		
		}		
	}
}
