# Tasks

The best workflow for a given jurisdiction will vary, however this outline is a good starting point.

<!-- TOC -->

- [Tasks](#tasks)
    - [Design templates](#design-templates)
    - [Gather Ballot Data](#gather-ballot-data)
    - [Generate Ballots](#generate-ballots)
    - [Proof ballots](#proof-ballots)

<!-- /TOC -->

## Design templates

In many cases the default template can be used without modification. But to make sure, ask yourself the following questions:

- Does any of the boilerplate text of the ballot need to be modified for this election?
- Does any of the functionality of the RBM need to be modified for this election?

If so, perform one or more of the following tasks

- [Modify Text](./LOCALIZATION.md)
- [Package PDF](./PACKAGING.md)
- [Sign PDF](./SIGNATURES.md) (optional, but strongly recommended)

> Please contact Hilton Roscoe if you need assistance modifying a template.

## Gather Ballot Data

Ballot data is represented using Election Markup Language's (EML) 410 schema, which represents data for one or more ballots in a given election. Ballot data will likely be exported out of an existing Election Management System (EMS). Sample ballot data is available under the `xml/` directory.

> A full treatment of ballot data is available [here](./BALLOT_DATA.md).

## Generate Ballots

Generation of ballots is currently a manual process, but is conceptually simple. It consists of embedding the RBM dataset for a particular ballot style into the packaged PDF. This can be achieved with the use of commercial tools such as Adobe Acrobat.

- [Loading Data](./ACROBAT.md)

Optional tasks:

- [Sign XML Data](./SIGNATURES.md)

## Proof ballots

Note that there isn't a ballot layout step. This is because ballots are not laid out, but generated. Generation can be customized by taking advantage of [extensions to the EML 410 format](./EML-410_extensions.md).

**TODO: Add Proofing Instructions**
