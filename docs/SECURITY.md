# RBM Security

The security of the RBM solution relies on the security features of PDF, XFA, and the Adobe Acrobat platform.

## PDF Security

A PDF can be endorsed with a `certifying signature`. These certifying signature covers the entire document, with the exception of the data sections of the document, so that the form can be filled in and saved without invalidating the signature. This provides assurances that the document has not been modified in transit.

## XFA Security

Additionally, a XFA document may include a signed XML dataset, using XML Signatures. This dataset provides assurances that the data has not been modified in transit. Only a subset of the dataset is signed, the EML payload. A RBM specific section of the XML dataset that includes indications made by the voter is not signed.

## Platform Security

Using the Adobe Acrobat platform provides capabilities to validate and inspect the signatures made, as well as provided additional assurances, such that the document cannot connect to an outside network, including the internet without permission of the user.

## Further reading

- [Digital Signatures in a PDF](https://www.adobe.com/devnet-docs/acrobatetk/tools/DigSig/Acrobat_DigitalSignatures_in_PDF.pdf)
- [Digital Signatures in XFA Documents](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/digisig_in_XFA.pdf)
