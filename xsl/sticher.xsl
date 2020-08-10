<?xml version="1.0"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xdp="http://ns.adobe.com/xdp/" xmlns:t="http://www.xfa.org/schema/xfa-template/3.3/" xmlns:xe="http://www.altova.com/xslt-extensions" extension-element-prefixes="xe">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<!--Identity template, 
        provides default behavior that copies all content into the output -->
	<xsl:template match="@* | node()">
		<xsl:choose>
			<xsl:when test="@usehref">
				<xsl:call-template name="flattenRef">
					<xsl:with-param name="usehref" select="@usehref"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy>
					<xsl:apply-templates select="@* | node()"/>
				</xsl:copy>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- flattens references -->
	<xsl:template name="flattenRef">
		<xsl:param name="usehref"/>
		<!-- current document-uri for resolving relative references -->
		<xsl:param name="uriContext" tunnel="yes"/>
		<!-- we first must classify the useref object to be any of the following forms:
			- #ID, an XML IDREF
			- URI#ID, a remote XML IDREF
			- #som(expression), a SOM
			- URI#som(expression), a remote SOM
			- URI, an unqualified remote uri
			-->
		<xsl:choose>
			<xsl:when test="contains($usehref,'xfs')">
				<!-- we don't support style sheets, they use the proto section which appears to be transparent in template DOM,
			 which we don't have routines to hadnle -->
				<xsl:copy>
					<xsl:apply-templates select="@* | node()"/>
				</xsl:copy>
			</xsl:when>
			<!-- matches URI#som(expression) -->
			<xsl:when test="matches($usehref, '\w+[^\s]#som\(\w+[^\s]+\)')">
				<xsl:call-template name="flattenRef2">
					<xsl:with-param name="uriPath" select="replace(tokenize($usehref, '#som')[1],'\\','/')"/>
					<xsl:with-param name="somExpression" select="tokenize($usehref, '#som\(')[2]"/>
					<xsl:with-param name="uriContext" select="$uriContext"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="matches($usehref, '#som\(\w+[^\s]+\)')">
				<xsl:call-template name="flattenRef2">
					<xsl:with-param name="uriPath" select="''"/>
					<xsl:with-param name="somExpression" select="tokenize($usehref, '#som\(')[2]"/>
					<xsl:with-param name="uriContext" select="$uriContext"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>Unrecognized href <xsl:value-of select="$usehref"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- needs a better name -->
	<xsl:template name="flattenRef2">
		<xsl:param name="somExpression"/>
		<xsl:param name="uriContext"/>
		<xsl:param name="uriPath"/>
		<!-- need to run in same directory as source of transform -->
		<xsl:variable name="xpathExpression">
			<xsl:call-template name="som2xpath">
				<xsl:with-param name="somExpression" select="$somExpression"/>
			</xsl:call-template>
		</xsl:variable>
		<!-- now we have xpath expression, so we can pull in the document -->
		<xsl:variable name="fqUri">
			<!-- resolve-uri is tempremental, so we can only call it when we need to -->
			<xsl:choose>
				<xsl:when test="$uriContext">
					<xsl:value-of select="resolve-uri($uriPath,$uriContext)"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$uriPath"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<!-- Pull in document -->
		<xsl:variable name="refDocument" select="document($fqUri)"/>
		<!-- Run XPath on document -->
		<xsl:message select="$xpathExpression/string()"/>
		<xsl:variable name="refDocumentFragment">
			<xsl:evaluate context-item="$refDocument" xpath="$xpathExpression/string()"/>
		</xsl:variable>
		<!-- finally recursively run templates on child document -->
		<xsl:apply-templates select="$refDocumentFragment">
			<!-- used for resolving relative uris -->
			<xsl:with-param name="uriContext" tunnel="yes" select="$refDocument/base-uri()"/>
		</xsl:apply-templates>
	</xsl:template>
	<xsl:template name="som2xpath">
		<xsl:param name="somExpression"/>
		<xsl:variable name="somExpressionParts" select="tokenize(substring-before($somExpression, ')'), '\.')"/>
		<xsl:variable name="xpathExpr">
			<xsl:for-each select="$somExpressionParts">
				<xsl:choose>
					<xsl:when test=". = '$template'">/xdp:xdp/t:template</xsl:when>
					<xsl:when test="starts-with(., '#')">/(t:<xsl:value-of select="substring-after(., '#')"/>|t:proto/t:<xsl:value-of select="substring-after(., '#')"/>)
					</xsl:when>
					<xsl:otherwise>/(node()[@name='<xsl:value-of select="."/>']|t:proto/node()[@name='<xsl:value-of select="."/>'])</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</xsl:variable>
		<xsl:value-of select="$xpathExpr"/>
		<!--|<xsl:value-of select="replace($xpathExpr,'/(\w+[^/\s]+)$','/t:proto/$1')" />-->
	</xsl:template>
</xsl:stylesheet>
