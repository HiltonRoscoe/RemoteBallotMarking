/** Version Control Object */
var oVersionInfo = {
    identifier:    "XFAUtils",
    assetType:     "fragment",
    description:   "Various helpers",
    currentVersion: 1 
};

/** Scrolls the specified control to the top of the current view and optional sets focus the the specified control.
 *  @param {form object} target   (required)	-- the control to place at the top of the current view.
 *  @param {form object} setFocus (optional) 	-- the control that receives focus.
 */
function scrollTo(target, setFocus)
{		
	var targetExtents = getExtents(target,xfa);	
	var targetContentArea = xfa.resolveNode(targetExtents[0].contentArea);
	if (setFocus !== undefined && setFocus.access === "open")
	{
		xfa.host.setFocus(setFocus);
	}
	if (targetExtents.length > 0)
	{
		event.target.pageNum = targetExtents[0].page;
		if (targetContentArea.parent.medium.orientation === "portrait")
		{
			var bottomMargin = getPoints(targetContentArea.parent.medium.long) - getPoints(targetContentArea.h) - getPoints(targetContentArea.y);
		}
		else
		{
			var bottomMargin = getPoints(targetContentArea.parent.medium.short) - getPoints(targetContentArea.h) - getPoints(targetContentArea.y);
		}
		var yCoord = getPoints(targetContentArea.h) - targetExtents[0].y + getPoints(targetContentArea.y) + bottomMargin;
		
		event.target.scroll(0, yCoord);
	}
}                              

function getPoints(measurement) {
    var vUnits = measurement.substr(-2);
    var vValue = parseFloat(measurement.substr(0, measurement.length - 2));
    switch (vUnits) {
    case "mm":
        vValue = vValue * 2.83464567;
        break;
    case "cm":
        vValue = vValue * 28.3464567;
        break;
    case "in":
        vValue = vValue * 72;
    }
    return vValue;
}

var contentAreas;
var pageAreas;
var xfaRoot;

/**
 * make a SOM expression more terse.
 * Remove the extraneous "[0]" qualifiers and remove the root elements.
 * @param vSOM the SOM expression to reduce
 * @return the reduced SOM expression.
 */
function terseSOM(vSOM) {
    vSOM = vSOM.replace(/^xfa\[0\]\./, "");
    vSOM = vSOM.replace(/\[0\]/g, "");
    vSOM = vSOM.replace(/^datasets\./, "");
    return vSOM.replace(/^form\./, "");
}

/**
 * Cache the positions and sizes of all the form objects so that
 * later processing can query extents efficiently.
 * Note that if your form layout changes e.g. subforms add/removed, this method needs
 * to be called again to update the cache.
 * @param vNewXFARoot -- the root xfa object of the document we are querying
 */
function initExtents(vNewXFARoot) {
    if (vNewXFARoot) {
        xfaRoot = vNewXFARoot;
    }

    // containers are found either under pageAreas or contentAreas.
    // Maintain lists of both
    pageAreas = [];
    contentAreas = [];

    // track the current content area or page area
    // When we get a list of objects back from $layout.pageContent, the content area
    // elements always come back before the content inside the content area.
    var vCurrentCA = null;
    var vCurrentPA = null;
    var i, j, nPage, vSOM, vObj;
    for (nPage = 0; nPage < xfaRoot.layout.pageCount(); nPage++) {
        // get a list of all content inside the content areas on this page.
        var vPageList = xfaRoot.layout.pageContent(nPage, "", false);
        for (i = 0; i < vPageList.length; i++) {
            vObj = vPageList.item(i);
            if (vObj.className === "pageArea") {
                continue;
            }
            // create an object to represent the current content area.
            if (vObj.className === "contentArea") {
                vCurrentCA = {};
                vCurrentCA.pageNo = nPage;
                vCurrentCA.SOM = terseSOM(vObj.somExpression);
                vCurrentCA.x = getPoints(vObj.x);
                vCurrentCA.y = getPoints(vObj.y);
                contentAreas.push(vCurrentCA);
            } else {
                vSOM = terseSOM(vObj.somExpression);
                var nOffset = 0;
                // nOffset will be the parameter to the layout.x(), y(), w() and h() functions.
                // We need to discover how many content areas this object has occured in
                // in order to know what the offset value is for the current content area
                for (j = 0; j < contentAreas.length - 1; j++) {
                    if (contentAreas[j][vSOM]) {
                        nOffset++;
                    }
                }
                // Create an entry for this object in the current content area, indexed by SOM
                vCurrentCA[vSOM] = {};
                vCurrentCA[vSOM].offset = nOffset;
                var vParent = vObj.parent;
                // Skip over subformset ancestors, because they do not have a position
                while (vParent.className === "subformSet") {
                    vParent = vParent.parent;
                }
                vCurrentCA[vSOM].parentSOM = terseSOM(vParent.somExpression);
                if (vParent.className === "exclGroup") {
                    // for some reason the layout methods do not handle exclusion groups.
                    // Create an entry for an exclusion group here, and hope it is positioned
                    var sExclSOM = vCurrentCA[vSOM].parentSOM;
                    vCurrentCA[sExclSOM] = {};
                    vCurrentCA[sExclSOM].offset = nOffset;
                    vCurrentCA[sExclSOM].x = getPoints(vParent.x);
                    vCurrentCA[sExclSOM].y = getPoints(vParent.y);
                    vCurrentCA[sExclSOM].w = getPoints(vParent.w);
                    vCurrentCA[sExclSOM].h = getPoints(vParent.h);
                    vCurrentCA[sExclSOM].parentSOM = terseSOM(vParent.parent.somExpression);
                }
                vCurrentCA[vSOM].x = xfaRoot.layout.x(vObj, "pt", nOffset);
                vCurrentCA[vSOM].y = xfaRoot.layout.y(vObj, "pt", nOffset);

                // x,y are relative to the margins of the parent object.
                if (vObj.parent.className === "subform" ) {
                    vCurrentCA[vSOM].y += getPoints(vObj.parent.margin.topInset);
                    vCurrentCA[vSOM].x += getPoints(vObj.parent.margin.leftInset);
                }

                vCurrentCA[vSOM].w = xfaRoot.layout.w(vObj, "pt", nOffset);
                vCurrentCA[vSOM].h = xfaRoot.layout.h(vObj, "pt", nOffset);
            }
        }

        // Done with content areas.
        // Now process pageAreas.  These are simpler because objects on pageAreas
        // do not span multiple pages.
        vCurrentPA = {};
        vCurrentPA.pageNo = nPage;
        pageAreas.push(vCurrentPA);
        vPageList = xfaRoot.layout.pageContent(nPage, "", true);
        for (i = 0; i < vPageList.length; i++) {
            vObj = vPageList.item(i);
            vSOM = terseSOM(vObj.somExpression);
            vCurrentPA[vSOM] = {};
            vCurrentPA[vSOM].offset = nPage;
            vCurrentPA[vSOM].parentSOM = terseSOM(vObj.parent.somExpression);
            vCurrentPA[vSOM].x = xfaRoot.layout.x(vObj, "pt", nOffset);
            vCurrentPA[vSOM].y = xfaRoot.layout.y(vObj, "pt", nOffset);
            vCurrentPA[vSOM].w = xfaRoot.layout.w(vObj, "pt", nOffset);
            vCurrentPA[vSOM].h = xfaRoot.layout.h(vObj, "pt", nOffset);
        }
    }
}

/**
 * This function returns an array of extents for a given object
 * There will be one entry in the array for each content area
 * an object appears in.
 * Each entry is an object with these properties:<br>
 *   Extent.page<br>
 *   Extent.contentArea  (SOM expression)<br>
 *   Extent.x            (absolute page position)<br>
 *   Extent.y<br>
 *   Extent.w<br>
 *   Extent.h   <br><br>
 * All measurements are points.
 * @param vObject -- the object to get extents for
 * @param xfaNode (optional) -- the root xfa node (could be from a separate document)
 * @return an array of extents.
 */
function getExtents(vObject, xfaNode)
{
    if (typeof(xfaNode) !== "undefined") {
        xfaRoot = xfaNode;
    }
    // The array of extents to return
    var vExtents = [];
    var vExtent;
    var i;
    var vParentSOM;

    // Special case for pageArea objects
    if (vObject.className === "pageArea") {
        vExtent = {};
        vExtent.h = xfaRoot.layout.h(vObject, "pt", 0);
        vExtent.w = xfaRoot.layout.w(vObject, "pt", 0);
        vExtent.x = 0;
        vExtent.y = 0;
        vExtent.page = xfaRoot.layout.page(vObject) - 1;
        vExtent.contentArea = "";
        vExtent.pageArea = vObject;
        vExtents.push(vExtent);
        return vExtents;
    }

    var vSOM = terseSOM(vObject.somExpression);
    var bFound = false;

    // Search for this object in the cached content areas.
    for (i = 0; i < contentAreas.length; i++) {
        // objects are indexed by their SOM expression
        if (contentAreas[i][vSOM]) {
            var vCA = contentAreas[i];
            bFound = true;
            vExtent = {};
            vExtent.h = vCA[vSOM].h;
            vExtent.w = vCA[vSOM].w;
            vExtent.x = vCA[vSOM].x + vCA.x;
            vExtent.y = vCA[vSOM].y + vCA.y;

            // translate relative coordinates to absolute coordinates
            // by traversing up the parent objects
            vParentSOM = vCA[vSOM].parentSOM;
            while (true) {
                if (vCA[vParentSOM]) {
                    vExtent.x += vCA[vParentSOM].x;
                    vExtent.y += vCA[vParentSOM].y;
                } else {
                    break;
                }
                vParentSOM = vCA[vParentSOM].parentSOM;
            }
            vExtent.page = vCA.pageNo;
            vExtent.contentArea = vCA.SOM;
            vExtent.pageArea = xfaRoot.form.resolveNode(vCA.SOM).parent;
            vExtents.push(vExtent);
        }
    }
    // If the object is not found inside content areas it must
    // be inside a page area.
    if (!bFound) {
        for (i = 0; i < pageAreas.length; i++) {
            if (pageAreas[i][vSOM]) {
                var vPA = pageAreas[i];
                vExtent = {};
                vExtent.h = vPA[vSOM].h;
                vExtent.w = vPA[vSOM].w;
                vExtent.x = vPA[vSOM].x;
                vExtent.y = vPA[vSOM].y;
                vParentSOM = vPA[vSOM].parentSOM;
                while (true) {
                    if (vPA[vParentSOM]) {
                        vExtent.x += vPA[vParentSOM].x;
                        vExtent.y += vPA[vParentSOM].y;
                    } else {
                        break;
                    }
                    vParentSOM = vPA[vParentSOM].parentSOM;
                }
                vExtent.page = vPA.pageNo;
                vExtent.contentArea = "";
                vExtent.pageArea = vObject.parent;

                while (vExtent.pageArea.className !== "pageArea") {
                    vExtent.pageArea = vObject.parent;
                }
                vExtents.push(vExtent);
                break;
            }
        }
    }
    return vExtents;
}

function getPoints(measurement)
{
	var vUnits = measurement.substr(-2);
	var vValue = parseFloat(measurement.substr(0, measurement.length-2));
	switch(vUnits)
	{
		case "in":
			vValue = vValue * 72;
			break;
		case "mm":
			vValue = vValue * 2.83464567;
			break;
		case "cm":
			vValue = vValue * 28.3464567;
			break;
	}
	return vValue;
}
