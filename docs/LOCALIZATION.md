# Localization and Customizing Text

This section describes how text in the RBM can be modified.

<!-- TOC -->

- [Localization and Customizing Text](#localization-and-customizing-text)
    - [Modifying boilerplate](#modifying-boilerplate)
        - [Modifying boilerplate via XLIFF](#modifying-boilerplate-via-xliff)
        - [Modifying the templates directly](#modifying-the-templates-directly)
    - [Fixed Size Objects](#fixed-size-objects)
    - [Floating Fields](#floating-fields)

<!-- /TOC -->

## Modifying boilerplate

In the RBM, boilerplate is defined as any text that is defined within the templates (i.e. `xdp`) themselves.

### Modifying boilerplate via XLIFF

> Consider having your template fully stitched into a single xdp before performing localization, or each `xdp` fragment will need to be localized separately.

The preferred approach to localization is to extract the text in the templates into XML Localization Interchange File Format (`XLIFF`) files, which can be edited using any text editor.

Follow the steps listed here to generate a XLIFF file from an XDP:

- [XLIFF with Adobe Designer](https://help.adobe.com/en_US/AEMForms/6.1/DesignerHelp/WS92d06802c76abadb-728f46ac129b395660c-8000.2.html)

Each translatable unit will be listed in the generated file. To change the boilerplate, simply add a `<target>` tag under `</source>` with the replacement content. The following example shows changing the header of the ballot from `OFFICIAL GENERAL ELECTION BALLOT` to `PRIMARY ELECTION TEST BALLOT`.

```xml
<group restype="description">
    <trans-unit id="A03E6F10-F9BC-4F38-ABA0-EC3C2769A407" resname="A03E6F10-F9BC-4F38-ABA0-EC3C2769A407">
        <source>
            <body xmlns="http://www.w3.org/1999/xhtml" xmlns:xliff="urn:oasis:names:tc:xliff:document:1.1" xmlns:xfa="http://www.xfa.org/schema/xfa-data/1.0/" xmlns:xdp="http://ns.adobe.com/xdp/">
                <p style="font-family:'Myriad Pro'">OFFICIAL GENERAL ELECTION BALLOT</p>
            </body>
        </source>
        <target>
            <body xmlns="http://www.w3.org/1999/xhtml" xmlns:xliff="urn:oasis:names:tc:xliff:document:1.1" xmlns:xfa="http://www.xfa.org/schema/xfa-data/1.0/" xmlns:xdp="http://ns.adobe.com/xdp/">
                <p style="font-family:'Myriad Pro'">PRIMARY ELECTION TEST BALLOT</p>
            </body>
        </target>
    </trans-unit>
</group>
```

> Note that the example above includes XHTML elements. Be sure all XHTML conforms to the `Rich Text` section of the [XFA 3.3 Specification](https://reference.pdfa.org/iso/32000/wp-content/uploads/2017/04/XFA-3_3.pdf)

> Note that the text may include floating fields. See the [floating fields](#floating-fields) section for more information.

### Modifying the templates directly

Modifying the templates directly is possible, but strongly discouraged. As new versions of the `RBM` are released, user made changes will need to be manually merged with new templates, which is error prone.

> One case where direct modification of templates is permissable is when changing the context of fixed size objects (see below).

## Fixed Size Objects

Only certain objects can grow based on their content. Other objects will clip, causing text to appear to be cut off. The following objects do not grow:

- MasterBoiler
  - BallotHeading
  - TestNotice
  - PageSection

## Floating Fields

Certain parts of boilerplate may contain `floating fields`. These fields represent placeholders where dynamic content may be placed. This content is either computed based on the filling of the form (e.g. the number of votes remaining in an n-of-m contest), or from the data itself.

> Note that all Field Ids start with `floatingField_`

The floating fields may be included rich text section by setting certain attributes on a `<span>`:

```xml
<span xfa:embedType="uri" xfa:embedMode="raw" xfa:embed="#floatingField_raceCode"/>
```

Floating fields may be bound to the RBM dataset, and thus to change their content, the incoming dataset must be modified.
