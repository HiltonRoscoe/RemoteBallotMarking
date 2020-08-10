/** Version Control Object */
var oVersionInfo = {
	identifier: "SelectionManager",
	assetType: "fragment",
	description: "Emulates an exclusion group that allows multiple selections",
	currentVersion: 1
};

var mostRecentlyCheckedSOM = "";

/**
 * setMinAndMax -- call this from subform initialize to set the minimum and maximum 
 * 					number of entries that may be selected.
 * @param vSubform -- the exclusion subform
 * @param vMin -- minimum number of entries
 * @param vMax -- maximum number of entries
 */
function setMinAndMax(vSubform, vMin, vMax) {
	// Store these values as variables on the exclusion subform
	if (vSubform.variables.nodes.namedItem("vMinSelected") == null)
		vSubform.variables.nodes.append(xfa.form.createNode("integer", "vMinSelected"));

	if (vSubform.variables.nodes.namedItem("vMaxSelected") == null)
		vSubform.variables.nodes.append(xfa.form.createNode("integer", "vMaxSelected"));

	vSubform.vMinSelected.value = vMin;
	vSubform.vMaxSelected.value = vMax;
}

/**
 * isSelected(vContainer) -- check if there are any populated values
 * 
 * @param vContainer -- the field/exclGroup/subform/subformSet/area to check
 * @return - boolean: true if something in the container is selected, false otherwise.
 */
function isSelected(vContainer) {
	switch (vContainer.className) {
		case "field":
			////console.println(vContainer.name + " " + vContainer.className + " " + vContainer.ui.oneOfChild.className);
			// Different logic to check selected based on field type
			if (vContainer.ui.oneOfChild.className == "checkButton") {
				// We are concerned only about Reader 8 and beyond so we
				// will simply check if the vContainer.selectedIndex == 0
				// But to be compatible with Reader 7 we'll do it the hard way.
				////console.println("ugh " + vContainer.selectedIndex );
				// The "on" value is represented by the first element under <items>:
				// <field>
				//   <items>
				//	   <text>yes</text>
				//     <text>no</text>
				//   </items>
				// </field>

				if (vContainer.selectedIndex == 0)
					return true;
			}
			else //we do not support any other field types
			{
				// A text/numeric field etc.
				return false;
			}
			break;
		case "exclGroup":
			if (!vContainer.isNull && vContainer.rawValue != "")
				return true;
			break;
		case "area":
		case "subform":
		case "subformSet":
			// Loop through the nested objects
			for (var i = 0; i < vContainer.nodes.length; i++) {
				if (isSelected(vContainer.nodes.item(i)))
					return true;
			}
	}
	return false;
}

/**
 * clearContainer() - clean any populated values in the container and all nested children
 * 
 * @param vContainer - the field/subform... to empty
 */
function clearContainer(vContainer) {
	switch (vContainer.className) {
		case "field":
		case "exclGroup":
			// The most reliable way to set a field/exclusion group to null
			// is to set the dataNode to null.
			// ... but if the binding is set to "none" there will not be a dataNode
			if (vContainer.dataNode != null)
				vContainer.dataNode.isNull = true;
			else
				vContainer.rawValue = null;
			break;
		case "area":
		case "subform":
		case "subformSet":
			for (var i = 0; i < vContainer.nodes.length; i++)
				clearContainer(vContainer.nodes.item(i));
	}
}

/**
 * setMandatory() Set the mandatory state of a container
 * 
 * @param vContainer -- the container (field/subform etc) to modify
 * @param vMakeMandatory -- true: set mandatory, false: set not mandatory
 */
function setMandatory(vContainer, vMakeMandatory) {
	switch (vContainer.className) {
		case "field":
		case "exclGroup":
			// Mandatory enum is one of: "error" (mandatory)
			//                           "disabled" (optional)
			//                           "warning" (overrideable)
			if (vContainer.presence != "hidden") {
				if (vMakeMandatory) {
					if (vContainer.mandatory != "warning") {
						//console.println("manding " + vContainer.somExpression);
						vContainer.mandatory = "warning";
					}
					//vContainer.mandatory = "error";					
				}
				else {
					//console.println("demand " + vContainer.somExpression);
					vContainer.mandatory = "disabled";
				}
			}
			break;
		case "area":
		case "subform":
		case "subformSet":
			// Propagate the mandatory setting to all nested objects
			for (var i = 0; i < vContainer.nodes.length; i++)
				setMandatory(vContainer.nodes.item(i), vMakeMandatory);
	}
}
/*
 * Make sure that only one child of a given subform is selected.
 * @param vSubform -- a reference to the subform object we want to make exclusive
 */
function makeExclusive(vSubform) {
	// Build a list of all children that look like they are selected
	// Because this loop examines all the children objects, it has 
	// the nice side-effect of making this calculation 
	// dependent on the values of all its children. This means that if
	// any children change this calculation will re-fire.
	var vSelectedContainers = new Array();
	var vNumSubforms = vSubform.nodes.length;
	for (var i = 0; i < vNumSubforms; i++) {
		var vChild = vSubform.nodes.item(i);
		if (isSelected(vChild)) {
			vSelectedContainers[vSelectedContainers.length] = vChild;
		}
	}
	var vNumSelectedContainers = vSelectedContainers.length;
	//only do the check if we have exceeded our limit
	if (vNumSelectedContainers > vSubform.vMaxSelected.value) {
		// Now that we have the list of selected containers, we need to make sure 
		// that the number selected is in the specified range.	
		for (var j = 0; j < vNumSelectedContainers; j++) {
			// try to find the most recently selected container
			// we must uncheck it (since we can't keep it from being)
			// checked in the first place
			if (vSelectedContainers.length > 1 &&
				vSelectedContainers[j].somExpression == mostRecentlyCheckedSOM
			) {
				xfa.host.messageBox("Please uncheck your previous choice before making a new choice. This helps make sure you only change your vote when you mean to change it.", "Too many selections", 3);
				// clear the most recently selected container				
				clearContainer(vSelectedContainers[j]);
				mostRecentlyCheckedSOM = "";
				//we can stop iterating at this point
				break;
			}
		}
	}
	else {
		// If the user has selected less than the maximum, make everything mandatory
		// This way the form won't submit until they've selected the maximum number of entries
		// If we want to be less strict about undervotes, we can change this to < vSubform.vMinSelected
		var vMandatory = vSelectedContainers.length < vSubform.vMaxSelected.value;
		setMandatory(vSubform, vMandatory);
	}
	vMandatory = vSelectedContainers.length < vSubform.vMaxSelected.value;
	var vHelper = vSubform.resolveNode("UndervoteHelper");
	if (vMandatory) {
		//populate the non-obtrusive undervote notification
		vHelper.rawValue = "You can choose " + (vSubform.vMaxSelected.value - vSelectedContainers.length) + " more.";
	}
	else {
		vHelper.rawValue = " ";
	}
}
