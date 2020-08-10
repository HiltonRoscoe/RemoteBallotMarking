# Tasks with Acrobat

<!-- TOC -->

- [Tasks with Acrobat](#tasks-with-acrobat)
    - [Applying Certifying Signatures](#applying-certifying-signatures)
    - [Loading Data](#loading-data)
        - [Approach 1](#approach-1)

<!-- /TOC -->

## Applying Certifying Signatures

## Loading Data

> `RBM` does not consume EML 410 directly. Instead, the EML 410 payload must be wrapped by an RBM instance.  See [Data Formats](./DATA_FORMATS.md) for additional information.

### Approach 1

(requires Acrobat Standard or Pro)

1. Click on Tools
2. Click on Forms -> More Form Options
3. Select Import Data
4. You'll select a valid RBM file. Use files located at [xml](../xml) for examples. The PDF will bind to the fields of the form.
