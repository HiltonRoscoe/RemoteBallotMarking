# Interaction and Usability

This section describes how an end-user (i.e. Voter) may interact with the Remote Ballot Marker (RBM).

<!-- TOC -->

- [Interaction and Usability](#interaction-and-usability)
    - [General](#general)
    - [Interaction Modes](#interaction-modes)
    - [Marking Process](#marking-process)
        - [Overvote Protection](#overvote-protection)
        - [Undervote Protection](#undervote-protection)
            - [Undervote Helper](#undervote-helper)
    - [Printing](#printing)
    - [Accessibility](#accessibility)

<!-- /TOC -->

## General

The Remote Ballot Marker is based on Portable Document Format (`PDF`) technology. Each ballot is generated as a separate PDF that can be distributed to the voter. The voter can open the ballot using their PDF viewer of choice, though the use of Adobe Reader or Acrobat is strongly recommend (see [AcroForms](./ACROFORMS.md)).

`PDF` uses the well understood paper document metaphor. Thus, the Remote Ballot Marker can be thought of as a digital pen for a digital representation of a paper ballot. The default template renders ballots using Letter (8.5in x 11in) size paper. The interactive content area is broken into three columns, similar to traditional paper ballots.

`RBM` assumes a duplex printed ballot and provides cues to check both sides of the paper.

## Interaction Modes

`RBM` provides two fundamental interactions modes, that of a remote ballot marker, in which the voter marks the ballot using an on screen presentation of the ballot, or simply as a delivery mechanism for a blank ballot. In the second case, the RBM's only responsibility is the correct rendering of the ballot.

## Marking Process

The navigation of the ballot is the same as that of navigating any other PDF. The pages can be viewed in any order, and marked in any order. Selections are made by marking check boxes, which are rendered as ovals.

Additionally, the ballot can be saved to the voter's local computer, allowing the marking process to be paused and resumed later.

### Overvote Protection

Overvotes are not allowed. Instead, if the voter attempts to make more than then the allow selections for a given contest, the selection is not made and the voter is notified of how to change their vote.

### Undervote Protection

Undervotes can be avoided by optionally running validation on the ballot. The validator will highlight in blue any of the contests that have unallocated votes. It can also change the focus to the first contest that contains an overvote.

#### Undervote Helper

For contests using the default header, a helper subform indicates to the voter in real time the number of unallocated votes they have. This message is of the form:

```text
You can choose {VotesLeft} more.
```

> When {VotesLeft} = {MaxVotes}, the message is removed.

## Printing

The ballot can be printed at any time. Optionally, the `RBM` can be configured to provide a warning if the voter attempts to print a ballot that contains undervoted contests.

## Accessibility

`RBM` has been tested with screen readers, and is usable via keyboard navigation exclusively. The reading order for the screen reader is identical of that of a sighted user, from top to bottom, left to right.
