# Packaging XDPs into PDFs

In order to convert the source files into a usable PDF, all the files must be combined together to form a single XML Data Package (XDP). This is accomplished by a process of stitching the forms together. Two kinds of files can be stitched:

- `xdp`, representing a fragment of the larger form
- `xfs`, representing a prototype or stylesheet

Parts of the form that need to stitched together are indicated by the presence of the `usehref` attribute. These attributes can have a `URI` part and a Script Object Model (`som`) part. Only those that refer to an external document must be stitched together.

## Running the Stitcher

> Stitching should be applied to `host templates` only. These are the templates in the root of the `xdp/` directory.

A stitcher has been provided as part of the RBM. It is a XSLT3 script that takes as its input the template you wish to package. The output of the stitching process can be used as input to the `XfaBuilder` tool to generate the PDF.

## Additional Reading

- [Stitching Design Pattern](https://blogs.adobe.com/formfeed/2011/01/form-stitching-design-pattern.html)
