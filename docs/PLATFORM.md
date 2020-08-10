# Platform

This document describes the platform used to develop the Remote Ballot Marker (RBM), especially to those new to dynamic PDF forms.

## Dynamic Forms for Web Developers

The RBM is built using the [XML Forms Architecture](https://reference.pdfa.org/iso/32000/wp-content/uploads/2017/04/XFA-3_3.pdf) (`XFA`) technology. As its name implies, it defines an application (form), in terms of XML. `XFA` relies on a series of document object models (`DOMs`), each representing a separate concern:

|DOM  |Purpose  |
|---------|---------|
|XML Data DOM|Representing raw XML data|
|XFA Data DOM|Abstraction of the `XML Data DOM`|
|Template DOM|Representing boilerplate and bindable objects|
|Form DOM|Representing the binding of the `XFA Data DOM` to the `Template DOM`|
|Config DOM|Declarative configuration of the form|

To provide a modern analogy, consider an web application using a Model–view–viewmodel (MVVM) framework. The data source for various template parts is the `XML Data DOM`, the internal representation of the data (the ViewModel), is the `XFA Data DOM`, and the templates themselves are the `Template DOM`. As with modern web frameworks, applications can be composed (stitched) of multiple templates.

When a web page is rendered, the `HTML DOM` is constituted. Likewise, when an XFA form is rendered, the Form DOM is constituted.

> Unlike the HTML DOM, which is always in memory representation, the Form DOM can be saved to disk as part of a `XML Data Package` (XDP). End users rarely interact with XDPs directly, instead relying on a PDF's support for embedding (see below).

The `Config DOM` is used to configure the application, somewhat similar to how a `web.config` functions in a `.NET` application.

Binding between DOMs is accomplished using Script Object Model (`SOM`) expressions, which behaves somewhat similarly to `XPath`.

As much as possible, RBM leverages the declarative binding capabilities of `XFA`. Where a declarative solution is not feasible, additional scripting is offered through the use of `JavaScript`.

## PDF and XFA

For those with familiarity with the PDF specification, the above section about XML DOMs might seem out of place. Indeed, XFA forms should be seen as being *packaged as PDFs* rather than *being PDFs*. XFA forms rely on the renderer being aware of their capabilities to be properly displayed.

## Limitations

 XFA specification is referenced as an external specification necessary for full application of the ISO 32000-1 specification (PDF 1.7). Most PDF viewers on the other hand, only implement a subset of the PDF specification. Because of this reality, it is strongly recommended to use the Adobe desktop line of PDF readers, such as Adobe Acrobat.

> Mitigations for end-users of the RBM using an incompatible PDF viewer are [described here](docs/PAGEZERO.md).
