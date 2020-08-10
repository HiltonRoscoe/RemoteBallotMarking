# Ballot Data

This section describes that parts of EML 410 that are supported by RBM.

<!-- TOC -->

- [Ballot Data](#ballot-data)
    - [Ballot](#ballot)
    - [Contests](#contests)
        - [Headers](#headers)
            - [Default Contest Header](#default-contest-header)
            - [Ballot Measure Contest Header](#ballot-measure-contest-header)
            - [Instruction Contest Header](#instruction-contest-header)
        - [Representing Candidate Contests](#representing-candidate-contests)
            - [Write-In Contest Options](#write-in-contest-options)
        - [Representing Ballot Measure Contests](#representing-ballot-measure-contests)
    - [Voting Methods](#voting-methods)
    - [Order and Rotation](#order-and-rotation)
    - [Considerations for Selections Ballot Record](#considerations-for-selections-ballot-record)

<!-- /TOC -->

> This section uses [XPath](https://www.w3.org/TR/xpath-31/) conventions to make reference to various data points used in the ballot dataset.

Generating ballot data is a prerequisite to generating ballot styles. Ballot data can be packaged using one or more EML 410 packets. The EML 410 packet format was developed as part of the [1622-2011 - IEEE Standard for Electronic Distribution of Blank Ballots for Voting Systems](https://ieeexplore.ieee.org/document/6130556). Examples of ballot data are available under `/xml/`.

The following sections describe various parts of the ballot, and what data is required to define them.

## Ballot

> The RBM is initially bound to `/EML/Ballots/Ballot[0]` node of the dataset. If more than one `Ballot` is defined, only the first one will be rendered.

The only item bound to the RBM that is general to the ballot is the `Precinct {Name}`, which is bound to `BallotIdentifier/BallotName`.

## Contests

The following items are bound to the RBM:

- `ContestIdentifier/@IdNumber`
- `ContestIdentifier/ContestName`
- `HowToVote/Message[1]`
- `MaxVotes`
- `Messages[1]/Message[1]`
- `BallotChoices` (partially, see below)

### Headers

All contests have a header. RBM provides three header section templates:

- Default Contest Header
- Ballot Measure Contest Header
- Instruction Contest Header

#### Default Contest Header

The default contest header is used when no other header applies. It consists of:

```header
{RaceName}
Vote for not more than {MaxSelections}
```

With `{RaceName}` bound to `ContestIdentifier/ContestName` and `{MaxSelections}` bound to `MaxVotes`

> The text appearing in contest headers can be customized. See [Localization](./LOCALIZATION.md).

The default template also includes an *undervote helper*. For details on its functionality, see [Undervote Helper](./INTERACTION#undervote-helper).

#### Ballot Measure Contest Header

The ballot measure contest header is used for all ballot measures. It consists of:

```header
{RaceName}
{Instructions}
{QuestionBody}
```

With `{RaceName}` bound to `ContestIdentifier/ContestName`, `{Instructions}` bound to `HowToVote/Message[1]`, and `{QuestionBody}` bound to `Messages/Message[@Type = MeasureText][1]`

#### Instruction Contest Header

Finally, the instruction contest header is used for any non ballot measure that wishes to provide custom instruction text. It consists of:

```header
{RaceName}
{Instructions}
```

With `{RaceName}` bound to `ContestIdentifier/ContestName` and `{Instructions}` bound to `HowToVote/Message[1]`.

### Representing Candidate Contests

Candidate contest options are represented under `BallotChoices`.

The following items are bound to the RBM:

- `AffiliationIdentifier/RegisteredName`
- `CandidateIdentifier/IdNumber`
- `CandidateFullName/NameElement[1]`
- `WriteInCandidate` (see below)

> The default template will display the party name (`RegisteredName`) under the candidate's name, if provided.

#### Write-In Contest Options

A write-in contest option is generated once per emission of the `WriteInCandidate` element.

> `MaxWriteIn` is not used by the RBM to determine the number of write-ins to generate. However, an upstream system can use that element to determine how many `WriteInCandidate` elements to generate.

### Representing Ballot Measure Contests

Ballot measures consist of the ballot measure text (addressed under [Ballot Measure Contest Header](#ballot-measure-contest-header)), and a number of contest options to allow a response to be recorded.

The following items are bound to the RBM:

- `ProposalItem/ReferendumOptionIdentifier`
- `ProposalItem/SelectionText`

## Voting Methods

RBM supports two voting methods, `n-of-m` and Rank Choice Voting (`RCV`). The EML 410 schema refers to these two methods as `FPP` and `IRV`, respectively. A `VotingMethod` **must be** specified for every `Contest`.

## Order and Rotation

EML 410 provides a number of attributes and elements to store ordering data. However, the Remote Ballot Marker (RBM) *always* renders the ballot following reading order (i.e. the order elements appear in the file). Use of structures like `DisplayOrder` or `Rotation` are not prohibited - however, it is expected that a upstream system will use these attributes to transform the EML 410 instance into the proper reading order.

## Considerations for Selections Ballot Record

The Selections Ballot Record (SBR) consists of only the selections made by the voter. Each contest is tracked using the `ContestIdentifier/IdNumber`. Likewise, it uses the `CandidateIdentifier/IdNumber` for candidate contests, `ProposalItem/ReferendumOptionIdentifier` for ballot measure contests, and `WriteInIdentifier/IdNumber` for write-ins. The default encoding of the transcription barcode is based on a condensed version of the SBR. Thus, it is important that these codes are unique within a `Ballot`.
