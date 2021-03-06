# Remote Ballot Marking

This repository contains the Hilton Roscoe Remote Ballot Marker (RBM). The RBM provides core remote ballot marking functionality, such as:

- Support for N-of-M and RCV voting methods
- Ballot definition using EML 410
- Overvote protection
- Undervote warnings (prior to save, print, etc.)
- Ballot transcription (barcode) support with custom encodings and symbologies
- Signed code and data with inspectable signatures

Roadmap items:

- Control of barcode symbology at data level

## The RBM is a PDF

The RBM is a packaged as a self contained PDF. Use of PDF accomplishes two key goals:

- Enables a fully offline ballot marking experience
- Provides support for multiple workflows
  - Fill and print
  - Print and fill (by hand)

## Trying it out

The easiest way to try out the Remote Ballot Marker is to open one of the sample PDFs, located under `pdf/`.

## Getting Started

- [Technical Background](./docs/INTERNALS.md)
- [Non-technical Background](./docs/INTERACTION.md)
- [Tasks for Election Officials](./docs/TASKS.md)

## Ballot Styles

Ballot Styles are defined using `EML 410`. Please read that documentation for creating and loading ballot styles.

## Source Code

The source code for the RBM is provided as a series of `xdp` files. Each file represents a portion of the `XFA-template`.

## Generating PDFs from Source

PDFs can be generated by stitching the XDPs together such that they form a single `xdp` fragment. This can be accomplished using commercial tools or the `XfaBuilder`.

- [Packaging PDFs](./docs/PACKAGING.md)

## Limitations

The RBM is not designed to be a complete, turn key solution. The following features are considered out of scope:

- Voter Authentication
- Ballot Retrieval
- Ballot Return

> RBM should be considered a prototype. It is *not* intended to be used as-is.

## Additional Info

- [Platform](./docs/PLATFORM.md)
  - PDF Readers
  - Boilerplate
  - AcroForms support
  - [RBM Internals](./docs/INTERNALS.md)
- Ballot Definition
  - [Common Tasks](./docs/TASKS.md)
  - [Localization and Customization](./docs/LOCALIZATION.md)
  - [EML Extensions](./docs/EML-410_extensions.md)
  - Barcode Support
  - RCV Support
- [PDF and Data Signatures](./docs/SIGNATURES.md)
- [Packaging PDFs](./docs/packaging.md)
